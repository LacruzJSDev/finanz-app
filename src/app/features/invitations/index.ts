// Superficie pública de la feature. Otras features solo pueden importar de
// aquí, nunca de sus carpetas internas: esto es el contrato, y todo lo que se
// añada aquí es coste que pagan los demás.
export { GroupInvitations } from './pages/group-invitations/group-invitations';

// La abre el armazón de /grupos/:id, que es quien pone la acción de la página.
export {
  CreateInvitationForm,
  type CreateInvitationFormData,
} from './components/forms/create-invitation-form/create-invitation-form';
