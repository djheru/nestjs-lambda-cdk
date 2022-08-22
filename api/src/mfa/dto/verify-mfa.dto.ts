export type IdentifierType = 'email' | 'sms';
export class VerifyMfaDto {
  identifier: string;
  identifierType: IdentifierType;
  token: string;
  userId: string;
}
