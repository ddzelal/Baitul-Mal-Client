export interface AddCoordinatorRequestBody {
  organizationDomainId: string;
  data: {
    userIds: string[];
  };
}
