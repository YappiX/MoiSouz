export interface INewDocument {
  documentDate?: string;
  documentNumber?: string;
  documentType?: string;
  address: string;
  members?: { role: string; name: string }[] | null;
  invitedMembers?:
    | {
        role: string;
        firstName: string;
        lastName: string;
        middleName: string;
      }[]
    | null;
  questions?: {
    speaker: string;
    question: string;
  }[];
}
