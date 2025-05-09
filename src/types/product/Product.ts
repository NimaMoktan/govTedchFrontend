import { SampleTestType } from "../sample/sample";
import { Organisation } from "../organisation/Organisation";
interface TestType {
  id: number;
  sampleCode: string;
  code: string;
  description: string;
  quantityRequired: string;
  rateNu: number | string;
  testSiteCode: string;
  active: string
}

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
  amount: number;
  sampleTypeId: string;
  testCode: string;
  productDetailsEntities: {
    sampleTypeId: string;
    testCode: string;
    siteCode: string;
    typeOfWork: string;
    sourceOfSample: string;
    quantity: number;
    rate: number;
    totalAmount: number;
    amount: number;
    sampleTestType: SampleTestType;
    productTestType: TestType
  }[];
}

export interface ProductDetailsEntity {
  id: number;
  registrationId: number;
  sampleTestTypeId: number;
  testCode: string;
  sourceOfSample: string;
  typeOfWork: string;
  minimumQuantityRequired: string;
  ratesInNu: number;
  siteCOde: string;
  siteCode: string;
  createdBy: string;
  createdDate: string; // ISO date string
  updatedBy: string | null;
  updatedDate: string | null;
  quantity: number;
  amount: number;
  sampleTestType: SampleTestType;
  productTestType: TestType
}

export interface Registration {
  id: number;
  serviceId: string;
  organizationId: number;
  cid: string;
  name: string;
  address: string;
  contactNumber: string;
  emailAddress: string;
  submittedDate: string; // ISO date string
  verificationDate: string | null;
  approvalDate: string | null;
  productDetailsEntities: ProductDetailsEntity[];
  organizationDetails: Organisation;
  amount: number;
  applicationNumber: string;
  status: string;
  statusId: number;
  taskStatusId: number;
  siteCode: string;
}
