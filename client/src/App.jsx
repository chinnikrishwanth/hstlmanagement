import React, { useState, useEffect } from 'react';
import { User, DollarSign, Plus, X, Edit2, Trash2 } from 'lucide-react';

export default function HostelManagement() {
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [activeTab, setActiveTab] = useState('students');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState({});

  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchStudents();
    fetchPayments();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await fetch(`${API_URL}/students`);
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPayments = async () => {
    try {
      const res = await fetch(`${API_URL}/payments`);
      const data = await res.json();
      setPayments(data);
    } catch (err) {
      console.error(err);
    }
  };

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
        year: today.getFullYear(),
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

  const handleSubmit = async () => {
    try {
      if (modalType === 'addStudent') {
        await fetch(`${API_URL}/students`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        fetchStudents();
      } else if (modalType === 'editStudent') {
        await fetch(`${API_URL}/students/${selectedStudent._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        fetchStudents();
      } else if (modalType === 'addPayment') {
        await fetch(`${API_URL}/payments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        fetchPayments();
      }
      closeModal();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteStudent = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await fetch(`${API_URL}/students/${id}`, { method: 'DELETE' });
        fetchStudents();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white p-6 shadow-lg">
        <h1 className="text-3xl font-bold">Hostel Management System</h1>
      </header>

      <div className="container mx-auto p-6">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('students')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'students' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <User size={20} />
            Students
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'payments' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <DollarSign size={20} />
            Payments
          </button>
        </div>

        {activeTab === 'students' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Student Records</h2>
              <button
                onClick={() => openModal('addStudent')}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                <Plus size={20} />
                Add Student
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left p-3">Name</th>
                    <th className="text-left p-3">Email</th>
                    <th className="text-left p-3">Phone</th>
                    <th className="text-left p-3">Room</th>
                    <th className="text-left p-3">Monthly Fee</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student._id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{student.name}</td>
                      <td className="p-3">{student.email}</td>
                      <td className="p-3">{student.phone}</td>
                      <td className="p-3">{student.roomNumber}</td>
                      <td className="p-3">₹{student.monthlyFee}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs ${
                          student.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openModal('addPayment', student)}
                            className="text-green-600 hover:text-green-800"
                            title="Add Payment"
                          >
                            <DollarSign size={18} />
                          </button>
                          <button
                            onClick={() => openModal('editStudent', student)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => deleteStudent(student._id)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Records</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left p-3">Student Name</th>
                    <th className="text-left p-3">Month</th>
                    <th className="text-left p-3">Year</th>
                    <th className="text-left p-3">Amount</th>
                    <th className="text-left p-3">Payment Mode</th>
                    <th className="text-left p-3">Date</th>
                    <th className="text-left p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment._id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{payment.studentId?.name}</td>
                      <td className="p-3">{payment.month}</td>
                      <td className="p-3">{payment.year}</td>
                      <td className="p-3">₹{payment.amount}</td>
                      <td className="p-3 capitalize">{payment.paymentMode}</td>
                      <td className="p-3">{new Date(payment.paymentDate).toLocaleDateString()}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs ${
                          payment.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-bold">
                {modalType === 'addStudent' && 'Add New Student'}
                {modalType === 'editStudent' && 'Edit Student'}
                {modalType === 'addPayment' && 'Add Payment'}
              </h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              {(modalType === 'addStudent' || modalType === 'editStudent') && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    <input
                      type="text"
                      value={formData.phone || ''}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Room Number</label>
                    <input
                      type="text"
                      value={formData.roomNumber || ''}
                      onChange={(e) => setFormData({...formData, roomNumber: e.target.value})}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Address</label>
                    <textarea
                      value={formData.address || ''}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="w-full border rounded px-3 py-2"
                      rows="2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Guardian Name</label>
                    <input
                      type="text"
                      value={formData.guardianName || ''}
                      onChange={(e) => setFormData({...formData, guardianName: e.target.value})}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Guardian Phone</label>
                    <input
                      type="text"
                      value={formData.guardianPhone || ''}
                      onChange={(e) => setFormData({...formData, guardianPhone: e.target.value})}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Monthly Fee</label>
                    <input
                      type="number"
                      value={formData.monthlyFee || ''}
                      onChange={(e) => setFormData({...formData, monthlyFee: e.target.value})}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select
                      value={formData.status || 'active'}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              )}

              {modalType === 'addPayment' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Student</label>
                    <select
                      value={formData.studentId || ''}
                      onChange={(e) => {
                        const student = students.find(s => s._id === e.target.value);
                        setFormData({...formData, studentId: e.target.value, amount: student?.monthlyFee || ''});
                      }}
                      className="w-full border rounded px-3 py-2"
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
                      value={formData.month || ''}
                      onChange={(e) => setFormData({...formData, month: e.target.value})}
                      className="w-full border rounded px-3 py-2"
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
                      value={formData.year || ''}
                      onChange={(e) => setFormData({...formData, year: e.target.value})}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Amount</label>
                    <input
                      type="number"
                      value={formData.amount || ''}
                      onChange={(e) => setFormData({...formData, amount: e.target.value})}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Payment Mode</label>
                    <select
                      value={formData.paymentMode || 'cash'}
                      onChange={(e) => setFormData({...formData, paymentMode: e.target.value})}
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="cash">Cash</option>
                      <option value="online">Online</option>
                      <option value="card">Card</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {modalType === 'editStudent' ? 'Update' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}