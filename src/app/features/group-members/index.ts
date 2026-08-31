// Superficie pública de la feature. Otras features solo pueden importar de
// aquí, nunca de sus carpetas internas: esto es el contrato, y todo lo que se
// añada aquí es coste que pagan los demás.
export { GroupMembers } from './pages/group-members/group-members';

// El rol de una invitación es el mismo concepto que el de un miembro, así que
// se nombra igual en las dos pantallas.
export { MemberRoleLabelPipe } from './pipes/member-role-label.pipe';
