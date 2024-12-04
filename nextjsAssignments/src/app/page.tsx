'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import './styles.css';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  age: number;
  company: {
    name: string;
  };
}

interface ApiResponse {
  users: User[];
}

export default function Home() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [form, setForm] = useState<Partial<User>>({});
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://dummyjson.com/users');
        const result: ApiResponse = await response.json();
        setData(result.users);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleCreate = () => {
    const newUser = { ...form, id: data.length + 1 } as User;
    setData([...data, newUser]);
    setForm({});
  };

  const handleEdit = (user: User) => {
    setEditingId(user.id);
    setForm(user);
  };

  const handleUpdate = () => {
    setData(data.map((user) => (user.id === editingId ? { ...user, ...form } : user)));
    setEditingId(null);
    setForm({});
  };

  const handleDelete = (id: number) => {
    setData(data.filter((user) => user.id !== id));
  };

  if (loading) {
    return (
      <div className="container">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>User Management</h1>

      {/* Form for Create/Update */}
      <div className="form">
        <h2>{editingId ? 'Edit User' : 'Add New User'}</h2>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={form.firstName || ''}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={form.lastName || ''}
          onChange={handleInputChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email || ''}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="gender"
          placeholder="Gender"
          value={form.gender || ''}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={form.age || ''}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="company.name"
          placeholder="Company Name"
          value={form.company?.name || ''}
          onChange={handleInputChange}
        />
        <button onClick={editingId ? handleUpdate : handleCreate}>
          {editingId ? 'Update' : 'Create'}
        </button>
      </div>

      {/* Table of Users */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Gender</th>
            <th>Age</th>
            <th>Email</th>
            <th>Company</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>
                <Link href={`/user/${user.id}`}>
                  {`${user.firstName} ${user.lastName}`}
                </Link>
              </td>
              <td>{user.gender}</td>
              <td>{user.age}</td>
              <td>{user.email}</td>
              <td>{user.company.name}</td>
              <td>
                <button onClick={() => handleEdit(user)}>Edit</button>
                <button onClick={() => handleDelete(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
