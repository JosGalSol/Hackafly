
import PropTypes from 'prop-types'; 

const UserListTable = ({ users, handleToggleUserStatus, handleDeleteUser }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Usuario</th>
          <th>Email</th>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.username}</td>
            <td>{user.email}</td>
            <td>{user.firstName}</td>
            <td>{user.lastName}</td>
            <td>{user.isActive ? "Activo" : "Inactivo"}</td>
            <td>
              <button
                onClick={() => handleToggleUserStatus(user.id, user.isActive)}
              >
                {user.isActive ? "Deshabilitar" : "Habilitar"}
              </button>
              <button
                onClick={() => handleDeleteUser(user.id)}
                style={{ marginLeft: "10px" }}
              >
                Eliminar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// Validación de las propiedades
UserListTable.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      username: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      isActive: PropTypes.bool.isRequired,
    })
  ).isRequired,
  handleToggleUserStatus: PropTypes.func.isRequired,
  handleDeleteUser: PropTypes.func.isRequired,
};

export default UserListTable;