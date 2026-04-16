import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const [users, setUsers] = useState([]);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:5000/api/users");
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ CREATE or UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editId) {
      await axios.put(
        `http://localhost:5000/api/users/update/${editId}`,
        formData
      );
      setEditId(null);
    } else {
      await axios.post(
        "http://localhost:5000/api/users/add",
        formData
      );
    }

    setFormData({ name: "", email: "", message: "" });
    fetchUsers();
  };

  // ✅ DELETE
  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/users/delete/${id}`);
    fetchUsers();
  };

  // ✅ EDIT
  const handleEdit = (user) => {
    setFormData({
      name: user.name,
      email: user.email,
      message: user.message
    });
    setEditId(user._id);
  };

  // ✅ FILTERED USERS (SEARCH LOGIC)
  const filteredUsers = users.filter((user) => {
    const searchText = search.toLowerCase();

    return (
      user.name.toLowerCase().includes(searchText) ||
      user.email.toLowerCase().includes(searchText) ||
      user.message.toLowerCase().includes(searchText)
    );
  });

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>MERN CRUD Form</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />
        <br /><br />

        <input
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <br /><br />

        <textarea
          name="message"
          placeholder="Message"
          value={formData.message}
          onChange={handleChange}
        />
        <br /><br />

        <button type="submit">
          {editId ? "Update" : "Submit"}
        </button>
      </form>

      {/* SEARCH BAR */}
      <h3>Search Users</h3>

      <input
        type="text"
        placeholder="Search by name, email, message..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <br /><br />

      {/* USER LIST */}
      <h3>Submitted Data</h3>

      {filteredUsers.length === 0 ? (
        <p>No users found</p>
      ) : (
        filteredUsers.map((user) => (
          <div key={user._id}>
            <p><b>{user.name}</b> - {user.email}</p>
            <p>{user.message}</p>

            <button onClick={() => handleEdit(user)}>Edit</button>
            <button onClick={() => handleDelete(user._id)}>Delete</button>

            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default App;