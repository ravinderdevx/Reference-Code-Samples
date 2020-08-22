export default {
  vehicles: {
    vehicle: {},
    recentList: [],
    list: [],
    pagination: {},
    filters: {
      PageNumber: 1,
      PageSize: 6,
      BodyStyle: "",
      Make: "",
      Model: "",
      MinModelYear: "",
      MaxModelYear: "",
      MinMileage: "",
      MaxMileage: "",
      City: "",
      StateProvince: "",
      NumberOfSeats: "",
      Transmission: "",
      FuelType: "",
      Features: "",
      MinRate: "",
      MaxRate: "",
      OwnerId: "",
      OrderBy: "CreatedDate"
    }
  },
  bookings: {
    renterUpcomingTrips: {
      list: [],
      pagination: {}
    },
    renterPastTrips: {
      list: [],
      pagination: {}
    },
    ownerUpcomingTrips: {
      list: [],
      pagination: {}
    },
    ownerPastTrips: {
      list: [],
      pagination: {}
    },
    filters: {
      PageNumber: 1,
      PageSize: 5,
      CreatedDate: null,
      StartDate: null,
      EndDate: null,
      BookingStatus: null,
      RenterId: null,
      VehicleId: null,
      OwnerId: null,
      OrderBy: "CreatedDate desc"
    },
    booking: {
      appId: process.env.REACT_APP_APP_ID,
      vehicleId: "",
      startDateTime: "",
      endDateTime: "",
      renterIdentifier: "",
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      stateProvince: "",
      zipPostalCode: "",
      country: "",
      email: "",
      phone: "",
      driversLicenseNumber: ""
    },
  },
  listing: {
    appId: process.env.REACT_APP_APP_ID,
    id: null,
    makeId: "",
    model: "",
    modelYear: "",
    bodyStyle: "",
    mileage: "",
    licenseNumber: "",
    numberOfSeats: "",
    numberOfDoors: "",
    transmission: "",
    fuelType: "",
    dailyRate: "",
    description: "",
    driverAvailability: "",
    fuelConsumption: "",
    images: [],
    uploadedImages: [],
    ownerIdentifier: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    stateProvince: "",
    zipPostalCode: "",
    country: "",
    email: "",
    phone: "",
    driversLicenseNumber: ""
  },
  lists: {
    makes: [],
    bodyStyles: [],
    transmissionTypes: [],
    fuelTypes: [],
    bookingStatuses: []
  },
  user: {},
  review: {
    vehicleId: null,
    bookingId: null,
    userId: null,
    rating: 0,
    comment: null
  }
};
