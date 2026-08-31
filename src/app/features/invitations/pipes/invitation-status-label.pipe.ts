import { Pipe, PipeTransform } from '@angular/core';
import { InvitationStatusEnum } from '../../../core/models';

const INVITATION_STATUS_LABELS: Record<InvitationStatusEnum, string> = {
  [InvitationStatusEnum.Pending]: 'Pendiente',
  [InvitationStatusEnum.Accepted]: 'Aceptada',
  [InvitationStatusEnum.Expired]: 'Caducada',
};

@Pipe({ name: 'invitationStatusLabel' })
export class InvitationStatusLabelPipe implements PipeTransform {
  transform(status: InvitationStatusEnum): string {
    return INVITATION_STATUS_LABELS[status];
  }
}
