export type ProductResponse = {
  timestamp: number;
  statusCode: number;
  status: string;
  message: string;
  data: Product[];
};

export type Product = {
  id: number;
  sampleTestTypeId: number;
  testCode: string;
  sourceOfSample: string;
  typeOfWork: string;
  minimumQuantityRequired: string;
  ratesInNu: number;
  siteCOde: string;
  createdBy: string;
  createdDate: string; // ISO Date string
  updatedBy: string;
  updatedDate: string;
  applicantId: number;
  userRegistration: UserRegistration;
  quantity: number;
  ptlCode: string;
  amount: number;
};

export type UserRegistration = {
  applicantId: number;
  organizationId: number;
  address: string;
  contactNumber: string;
  emailAddress: string;
  submittedDate: string;
  verificationDate: string;
  approvalDate: string;
  productDetailsEntities: string[];
  cid: string;
  name: string;
};

export type ApplicationFormValues = {
  cid: string;
  name: string;
  address: string;
  contactNumber: string;
  emailAddress: string;
  organizationId: string;
  productDetailsEntities: {
    sampleTypeId: string;
    testCode: string;
    siteCode: string;
    typeOfWork: string;
    sourceOfSample: string;
    quantity: number;
    rate: number;
    totalAmount: number;
  }[];
}
