import React, { useState, useEffect } from 'react';
import { User, DollarSign, Plus, X, Edit2, Trash2, LogOut, ShieldCheck, Home } from 'lucide-react';
import Dashboard from './components/Dashboard';
import LoadingSpinner from './components/LoadingSpinner';
import Notification from './components/Notification';
import SearchBar from './components/SearchBar';
import Modal from './components/Modal';
import Button from './components/Button';
import DataTable from './components/DataTable';

export default function HostelManagement({ user, handleLogout }) {
  // --- Data State ---
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState(null);
  
  // --- CRUD State ---
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState({});

  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchStudents(), fetchPayments()]);
    } finally {
      setLoading(false);
    }
  };

  // --- DATA FETCHING FUNCTIONS ---
  const fetchStudents = async () => {
    try {
      const res = await fetch(`${API_URL}/students`); 
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error(err);
      showNotification('error', 'Failed to fetch students');
    }
  };

  const fetchPayments = async () => {
    try {
      const res = await fetch(`${API_URL}/payments`);
      const data = await res.json();
      setPayments(data);
    } catch (err) {
      console.error(err);
      showNotification('error', 'Failed to fetch payments');
    }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
  };

  const closeNotification = () => {
    setNotification(null);
  };

  // Helper to safely get student name (for payments table)
  const getStudentName = (studentId) => {
    const student = students.find(s => s._id === studentId);
    return student ? student.name : (studentId?.name || 'Unknown Student'); 
  };

  // Calculate dashboard stats
  const getDashboardStats = () => {
    const activeStudents = students.filter(s => s.status === 'active').length;
    const paidPayments = payments.filter(p => p.status === 'paid').length;
    const pendingPayments = payments.filter(p => p.status === 'pending').length;
    const monthlyRevenue = payments
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + p.amount, 0);
    const pendingAmount = payments
      .filter(p => p.status === 'pending')
      .reduce((sum, p) => sum + p.amount, 0);
    const occupiedRooms = students.filter(s => s.status === 'active').length;
    const occupancyRate = Math.round((occupiedRooms / 50) * 100);

    return {
      totalStudents: students.length,
      activeStudents,
      paidPayments,
      pendingPayments,
      monthlyRevenue,
      pendingAmount,
      occupiedRooms,
      totalRooms: 50,
      occupancyRate
    };
  };

  // Filter data based on search term
  const getFilteredStudents = () => {
    if (!searchTerm) return students;
    return students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.roomNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getFilteredPayments = () => {
    if (!searchTerm) return payments;
    return payments.filter(payment => {
      const studentName = getStudentName(payment.studentId).toLowerCase();
      return studentName.includes(searchTerm.toLowerCase()) ||
        payment.month.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.year.toString().includes(searchTerm);
    });
  };

  // --- CRUD MODAL LOGIC ---
  const openModal = (type, student = null) => {
    setModalType(type);
    setSelectedStudent(student);
    
    if (type === 'addStudent' || type === 'editStudent') {
      setFormData(student || {
        name: '', email: '', phone: '', address: '',
        roomNumber: '', guardianName: '', guardianPhone: '',
        monthlyFee: '', status: 'active'
      });
    } else if (type === 'addPayment') {
      const today = new Date();
      setFormData({
        studentId: student?._id || '',
        month: today.toLocaleString('default', { month: 'long' }),
        year: today.getFullYear().toString(),
        amount: student?.monthlyFee || '',
        paymentMode: 'cash',
        status: 'paid'
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({});
    setSelectedStudent(null);
  };
  
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      let url = `${API_URL}/students`;
      let method = 'POST';

      if (modalType === 'editStudent') {
        url = `${API_URL}/students/${selectedStudent._id}`;
        method = 'PUT';
      } else if (modalType === 'addPayment') {
        url = `${API_URL}/payments`;
      }

      await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (modalType === 'addPayment') {
        fetchPayments();
        showNotification('success', 'Payment added successfully');
      } else {
        fetchStudents();
        showNotification('success', modalType === 'editStudent' ? 'Student updated successfully' : 'Student added successfully');
      }
      
      closeModal();
    } catch (err) {
      console.error(err);
      showNotification('error', 'Failed to save data');
    }
  };

  const deleteStudent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    
    try {
      await fetch(`${API_URL}/students/${id}`, { method: 'DELETE' });
      fetchStudents();
      showNotification('success', 'Student deleted successfully');
    } catch (err) {
      console.error(err);
      showNotification('error', 'Failed to delete student');
    }
  };

  // Table columns configuration
  const studentColumns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    { key: 'roomNumber', header: 'Room' },
    { 
      key: 'monthlyFee', 
      header: 'Monthly Fee',
      render: (value) => `₹${value}`
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 rounded text-xs ${
          value === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, student) => (
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openModal('addPayment', student);
            }}
            className="text-green-600 hover:text-green-800"
            title="Add Payment"
          >
            <DollarSign size={18} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              openModal('editStudent', student);
            }}
            className="text-blue-600 hover:text-blue-800"
            title="Edit"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteStudent(student._id);
            }}
            className="text-red-600 hover:text-red-800"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )
    }
  ];

  const paymentColumns = [
    { 
      key: 'studentId', 
      header: 'Student Name',
      render: (value) => getStudentName(value)
    },
    { key: 'month', header: 'Month' },
    { key: 'year', header: 'Year' },
    { 
      key: 'amount', 
      header: 'Amount',
      render: (value) => `₹${value}`
    },
    { 
      key: 'paymentMode', 
      header: 'Payment Mode',
      render: (value) => value.charAt(0).toUpperCase() + value.slice(1)
    },
    { 
      key: 'paymentDate', 
      header: 'Date',
      render: (value) => new Date(value).toLocaleDateString()
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 rounded text-xs ${
          value === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {value}
        </span>
      )
    }
  ];

  // --- MAIN RENDER ---
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification */}
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={closeNotification}
        />
      )}

      <header className="bg-blue-600 text-white p-6 shadow-lg flex justify-between items-center">
        <h1 className="text-3xl font-bold">Hostel Management System</h1>
        
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-lg font-medium">
            <ShieldCheck size={20} /> Welcome, {user?.name}
          </span>
          <Button
            variant="danger"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut size={20} />
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto p-6">
        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-6">
          <Button
            variant={activeTab === 'dashboard' ? 'primary' : 'secondary'}
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2"
          >
            <Home size={20} />
            Dashboard
          </Button>
          <Button
            variant={activeTab === 'students' ? 'primary' : 'secondary'}
            onClick={() => setActiveTab('students')}
            className="flex items-center gap-2"
          >
            <User size={20} />
            Students
          </Button>
          <Button
            variant={activeTab === 'payments' ? 'primary' : 'secondary'}
            onClick={() => setActiveTab('payments')}
            className="flex items-center gap-2"
          >
            <DollarSign size={20} />
            Payments
          </Button>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div>
            <Dashboard stats={getDashboardStats()} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Students */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Students</h3>
                {loading ? (
                  <LoadingSpinner size="small" text="Loading students..." />
                ) : (
                  <div className="space-y-2">
                    {students.slice(0, 5).map(student => (
                      <div key={student._id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-gray-600">Room {student.roomNumber}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          student.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {student.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Payments */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Payments</h3>
                {loading ? (
                  <LoadingSpinner size="small" text="Loading payments..." />
                ) : (
                  <div className="space-y-2">
                    {payments.slice(0, 5).map(payment => (
                      <div key={payment._id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium">{getStudentName(payment.studentId)}</p>
                          <p className="text-sm text-gray-600">{payment.month} {payment.year}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹{payment.amount}</p>
                          <span className={`px-2 py-1 rounded text-xs ${
                            payment.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {payment.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Students Tab */}
        {activeTab === 'students' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Student Records</h2>
              <Button
                variant="success"
                onClick={() => openModal('addStudent')}
                className="flex items-center gap-2"
              >
                <Plus size={20} />
                Add Student
              </Button>
            </div>

            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              placeholder="Search students by name, email, or room number..."
            />

            {loading ? (
              <LoadingSpinner text="Loading students..." />
            ) : (
              <DataTable
                data={getFilteredStudents()}
                columns={studentColumns}
                onRowClick={(student) => openModal('editStudent', student)}
              />
            )}
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Payment Records</h2>
              <Button
                variant="success"
                onClick={() => openModal('addPayment')}
                className="flex items-center gap-2"
              >
                <Plus size={20} />
                Add Payment
              </Button>
            </div>

            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              placeholder="Search payments by student name, month, or year..."
            />

            {loading ? (
              <LoadingSpinner text="Loading payments..." />
            ) : (
              <DataTable
                data={getFilteredPayments()}
                columns={paymentColumns}
              />
            )}
          </div>
        )}
      </div>

      {/* CRUD Modal */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={
          modalType === 'addStudent' && 'Add New Student' ||
          modalType === 'editStudent' && 'Edit Student' ||
          modalType === 'addPayment' && 'Add Payment'
        }
      >
        {/* Student/Edit Form */}
        {(modalType === 'addStudent' || modalType === 'editStudent') && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name || ''} 
                onChange={handleFormChange} 
                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email || ''} 
                onChange={handleFormChange} 
                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input 
                type="text" 
                name="phone" 
                value={formData.phone || ''} 
                onChange={handleFormChange} 
                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Room Number</label>
              <input 
                type="text" 
                name="roomNumber" 
                value={formData.roomNumber || ''} 
                onChange={handleFormChange} 
                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Address</label>
              <textarea 
                name="address" 
                value={formData.address || ''} 
                onChange={handleFormChange} 
                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                rows="2" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Guardian Name</label>
              <input 
                type="text" 
                name="guardianName" 
                value={formData.guardianName || ''} 
                onChange={handleFormChange} 
                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Guardian Phone</label>
              <input 
                type="text" 
                name="guardianPhone" 
                value={formData.guardianPhone || ''} 
                onChange={handleFormChange} 
                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Monthly Fee</label>
              <input 
                type="number" 
                name="monthlyFee" 
                value={formData.monthlyFee || ''} 
                onChange={handleFormChange} 
                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select 
                name="status" 
                value={formData.status || 'active'} 
                onChange={handleFormChange} 
                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        )}

        {/* Payment Form */}
        {modalType === 'addPayment' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Student</label>
              <select
                name="studentId"
                value={formData.studentId || ''}
                onChange={(e) => {
                  const student = students.find(s => s._id === e.target.value);
                  setFormData({...formData, studentId: e.target.value, amount: student?.monthlyFee || ''});
                }}
                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Student</option>
                {students.map(s => (
                  <option key={s._id} value={s._id}>{s.name} - Room {s.roomNumber}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Month</label>
              <select 
                name="month" 
                value={formData.month || ''} 
                onChange={handleFormChange} 
                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Year</label>
              <input 
                type="number" 
                name="year" 
                value={formData.year || ''} 
                onChange={handleFormChange} 
                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Amount</label>
              <input 
                type="number" 
                name="amount" 
                value={formData.amount || ''} 
                onChange={handleFormChange} 
                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Payment Mode</label>
              <select 
                name="paymentMode" 
                value={formData.paymentMode || 'cash'} 
                onChange={handleFormChange} 
                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="cash">Cash</option>
                <option value="online">Online</option>
                <option value="card">Card</option>
              </select>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={closeModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {modalType === 'editStudent' ? 'Update' : 'Save'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}

