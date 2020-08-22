interface GroupModel {
    _id: any;
    GroupName: string;
    ParentGroupId: any;
    PreviousGroupId: string;
    CurrentGroupId: string;
    LocationId: string;
    tempIndex: number;
    action: string
}
  
interface LocationModel {
    _id: any;
    LocationName: string;
    ContactName: string;
    Email: string;
    Phone: string;
    Address: string;
    ParentGroupId: any;
    action: string;
}