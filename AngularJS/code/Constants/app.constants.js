angular.module('app.constants', [])
  .constant('DATECONFIGS', {
    dateOptionsDefault: {
      'show-weeks': false,
      'format-month': 'MM'
    },
    dateOptions: {
      'show-weeks': false,
      'format-month': 'MM',
      //'max-date': "'2005-01-01'"
      'min-date': "'1900-01-01'"
    },
    dateStart: '2000-01-01'
  })

  .constant('IMAGECONFIGS', {
    avatar: {
      maxWidth: 300,
      maxHeight: 300
    },
    logo: {
      maxWidth: 300,
      maxHeight: 300
    }
  })

  .constant('COMPARE', {
    clientIncentivesGoal: [
      {
        "name": "NIH Level",
        "value": "<"
      },
      {
        "name": "Standard Tagets",
        "value": "="
      },
      {
        "name": "Generous Tagets",
        "value": ">"
      }

    ],
    clientIncentivesReward: [
      {
        "name": "Single Reward",
        "value": "single"
      },
      {
        "name": "Family Reward",
        "value": "family"
      }
    ],
    clientIncentivesNicotine: [
      {
        "name": "Negative",
        "value": "no"
      },
      {
        "name": "positive",
        "value": "yes"
      }
    ],
    clientIncentivesTargets: [
      {
        "name": "NIH Level",
        "value": 0
      },
      {
        "name": "Standard Targets",
        "value": 1
      },
      {
        "name": "Generous Targets",
        "value": 2
      }
    ],
    clientIncentivesTargetsNIHLevel: [
      {
        "name": "bodyMassIndexGoal",
        "value": "<=24.9"
      },
      {
        "name": "bloodPressureGoal",
        "value": "<=120/80"
      },
      {
        "name": "bloodSugarGoal",
        "value": "<=100"
      },
      {
        "name": "ldlCholesterolGoal",
        "value": "<=100"
      },
      {
        "name": "nicotinUseGoal",
        "value": "no"
      },
      {
        "name": "participationGoal",
        "value": ""
      },
      {
        "name": "healthCoachingGoal",
        "value": ""
      }
    ]

  })

  .constant('QUESTIONS', {
    questions1: [
      {
        value: 1,
        question: 'What were the last four digits of your childhood telephone number?'
      },
      { value: 2, question: 'What is the middle name of your oldest child?' },
      { value: 3, question: 'What primary school did you attend?' },
      { value: 4, question: 'In what city or town does your nearest sibling live?' }
    ],
    questions2: [
      { value: 1, question: 'In what town or city was your first full time job?' },
      { value: 2, question: "What are the last five digits of your driver's licence number?" },
      { value: 3, question: "What is your grandmother's (on your mother's side) maiden name?" },
      {
        value: 4,
        question: 'What was the house number and street name you lived in as a child?'
      }
    ]
  })

  .constant('ARCHIVE', {
    active: 'Active',
    inactive: 'Inactive'
  })

  .constant('ROLES', {
    health_coach: [
      {
        label: 'Health Coach',
        value: 'HealthCoach'
      }, {
        label: 'Health Coach Manager',
        value: 'HealthCoachManager'
      }
    ]

  })

  .constant('STATES', {
    list: [
      {
        "name": "Alabama",
        "abbreviation": "AL"
      },
      {
        "name": "Alaska",
        "abbreviation": "AK"
      },
      {
        "name": "American Samoa",
        "abbreviation": "AS"
      },
      {
        "name": "Arizona",
        "abbreviation": "AZ"
      },
      {
        "name": "Arkansas",
        "abbreviation": "AR"
      },
      {
        "name": "California",
        "abbreviation": "CA"
      },
      {
        "name": "Colorado",
        "abbreviation": "CO"
      },
      {
        "name": "Connecticut",
        "abbreviation": "CT"
      },
      {
        "name": "Delaware",
        "abbreviation": "DE"
      },
      {
        "name": "District Of Columbia",
        "abbreviation": "DC"
      },
      /*{
       "name": "Federated States Of Micronesia",
       "abbreviation": "FM"
       },*/
      {
        "name": "Florida",
        "abbreviation": "FL"
      },
      {
        "name": "Georgia",
        "abbreviation": "GA"
      },
      {
        "name": "Guam",
        "abbreviation": "GU"
      },
      {
        "name": "Hawaii",
        "abbreviation": "HI"
      },
      {
        "name": "Idaho",
        "abbreviation": "ID"
      },
      {
        "name": "Illinois",
        "abbreviation": "IL"
      },
      {
        "name": "Indiana",
        "abbreviation": "IN"
      },
      {
        "name": "Iowa",
        "abbreviation": "IA"
      },
      {
        "name": "Kansas",
        "abbreviation": "KS"
      },
      {
        "name": "Kentucky",
        "abbreviation": "KY"
      },
      {
        "name": "Louisiana",
        "abbreviation": "LA"
      },
      {
        "name": "Maine",
        "abbreviation": "ME"
      },
      {
        "name": "Marshall Islands",
        "abbreviation": "MH"
      },
      {
        "name": "Maryland",
        "abbreviation": "MD"
      },
      {
        "name": "Massachusetts",
        "abbreviation": "MA"
      },
      {
        "name": "Michigan",
        "abbreviation": "MI"
      },
      {
        "name": "Minnesota",
        "abbreviation": "MN"
      },
      {
        "name": "Mississippi",
        "abbreviation": "MS"
      },
      {
        "name": "Missouri",
        "abbreviation": "MO"
      },
      {
        "name": "Montana",
        "abbreviation": "MT"
      },
      {
        "name": "Nebraska",
        "abbreviation": "NE"
      },
      {
        "name": "Nevada",
        "abbreviation": "NV"
      },
      {
        "name": "New Hampshire",
        "abbreviation": "NH"
      },
      {
        "name": "New Jersey",
        "abbreviation": "NJ"
      },
      {
        "name": "New Mexico",
        "abbreviation": "NM"
      },
      {
        "name": "New York",
        "abbreviation": "NY"
      },
      {
        "name": "North Carolina",
        "abbreviation": "NC"
      },
      {
        "name": "North Dakota",
        "abbreviation": "ND"
      },
      {
        "name": "Northern Mariana Islands",
        "abbreviation": "MP"
      },
      {
        "name": "Ohio",
        "abbreviation": "OH"
      },
      {
        "name": "Oklahoma",
        "abbreviation": "OK"
      },
      {
        "name": "Oregon",
        "abbreviation": "OR"
      },
      {
        "name": "Palau",
        "abbreviation": "PW"
      },
      {
        "name": "Pennsylvania",
        "abbreviation": "PA"
      },
      {
        "name": "Puerto Rico",
        "abbreviation": "PR"
      },
      {
        "name": "Rhode Island",
        "abbreviation": "RI"
      },
      {
        "name": "South Carolina",
        "abbreviation": "SC"
      },
      {
        "name": "South Dakota",
        "abbreviation": "SD"
      },
      {
        "name": "Tennessee",
        "abbreviation": "TN"
      },
      {
        "name": "Texas",
        "abbreviation": "TX"
      },
      {
        "name": "Utah",
        "abbreviation": "UT"
      },
      {
        "name": "Vermont",
        "abbreviation": "VT"
      },
      {
        "name": "Virgin Islands",
        "abbreviation": "VI"
      },
      {
        "name": "Virginia",
        "abbreviation": "VA"
      },
      {
        "name": "Washington",
        "abbreviation": "WA"
      },
      {
        "name": "West Virginia",
        "abbreviation": "WV"
      },
      {
        "name": "Wisconsin",
        "abbreviation": "WI"
      },
      {
        "name": "Wyoming",
        "abbreviation": "WY"
      }
    ],
    countries: [
      'United States'
    ]
  })

  .constant('ERRORCODES', {
    conflict: {
      username: 1002,
      password: 1001,
      email: 1003,
      phone: 1004,
      customerId: 1005
    }
  })

  .constant('BENICOMPSELECT', {
    annualMaximum: [
      { id: 1, label: '$5,000', value: 5000 },
      { id: 2, label: '$10,000', value: 10000 },
      { id: 3, label: '$15,000', value: 15000 },
      { id: 4, label: '$20,000', value: 20000 },
      { id: 5, label: '$25,000', value: 25000 },
      { id: 6, label: '$35,000', value: 35000 },
      { id: 7, label: '$50,000', value: 50000 },
      { id: 8, label: '$75,000', value: 75000 },
      { id: 9, label: '$100,000', value: 100000 },
      { id: 10, label: '$200,000', value: 200000 }
    ]
  })

  .constant('CHANGEFORM', {
    typeOfChange: [
      { id: 1, label: 'Insured and Dependent Information', name: 'insuredAndDependentInformation', value: 1, active: false },
      { id: 2, label: 'Base Health Insurance Summary Plan Description (SPD)', name: 'baseHealthInsuranceSPD', value: 2, active: true }
    ],

    nameChangeDependentsCount: [
      { id: 1, label: 'One' },
      { id: 2, label: 'Two' },
      { id: 3, label: 'Three' },
      { id: 4, label: 'Four' }
    ],

    relationshipToInsured: [
      { id: 'spouse', label: 'Spouse' },
      { id: 'child', label: 'Child' },
      { id: 'other', label: 'Other' }
    ],
    terminateDependentReason: [
      { id: 'deathOfDependent', label: 'Death of Dependent' },
      { id: 'divorce', label: 'Divorce' },
      { id: 'marriageOfMinorDependent', label: 'Marriage of Minor Dependent' },
      { id: 'dependentExceedsTheAgeLimit', label: 'Dependent Exceeds the Age Limit' },
      { id: 'other', label: 'Other' }
    ],
    addDependentReason: [
      { id: 'marriage', label: 'Marriage' },
      { id: 'birth', label: 'Birth' },
      { id: 'adoption', label: 'Adoption' },
      { id: 'other', label: 'Other' }
    ],

    maritalStatusList: [
      { id: 'married', label: 'Married' },
      { id: 'domesticPartnership', label: 'Domestic Partnership' },
      { id: 'divorced', label: 'Divorced' },
      { id: 'widowed', label: 'Widowed' },
      { id: 'other', label: 'Other' }
    ],

    sexList: [
      { id: 0, label: 'Female' },
      { id: 1, label: 'Male' }
    ],

    addTerminateDependentTarget: [
      { id: 'add', label: 'Add a Dependent' },
      { id: 'term', label: 'Term a Dependent' }
    ]

  })

  .constant('CHANGEFORMPARTICIPANT', {
    reasonForChangeList: {
      M: 'Married',
      D: 'Divorced',
      other: 'Other'
    },
    sexList: {
      M: 'Male',
      F: 'Female'
    },

    maritalStatusList: {
      M: 'Married',
      P: 'Domestic Partnership',
      D: 'Divorced',
      W: 'Widowed',
      other: 'Other'
    }
  })
  .constant('DIRECTDEPOSIT', {
    choiceType: [
      { id: 1, label: 'New Enrollment', name: 'newEnrollment', value: 1 },
      { id: 2, label: 'Account Change', name: 'accountChange', value: 2 },
      { id: 3, label: 'Cancel Electronic Funds Transfer', name: 'cancelElectronicFundsTransfer', value: 3 }
    ],
    accountType: [
      { id: 1, label: 'Checking', name: 'checking', value: 1 },
      { id: 2, label: 'Savings', name: 'savings', value: 2 }
    ]

  })

  .constant('PATTERNREGEXS', {
    email: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    phone: /^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$/,
    ssn: /^(\d{3}-?\d{2}-?\d{4}|XXX-XX-XXXX)$/,
    date: /[0-9]{2}/,
    month: /[0-9]{2}/,
    year: /[0-9]{4}/,
    password: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/,
    number: /^\d+$/,
    currency: /^\d+(\.|\,)\d{2}$/,
  })

  .constant('LABVALUES', {
    glucose: {
      name: 'glucose',
      biomarker: 'Blood Glucose',
      start: 70,
      end: 100,
      ranges: [
        {
          min: '70',
          max: '100',
          definition: 'Normal',
          source: 'US National Library of Medicine'
        },
        {
          min: '101',
          max: '125',
          definition: 'Borderline',
          source: 'US National Library of Medicine'
        },
        {
          min: '126',
          max: '199',
          definition: 'High',
          source: 'US National Library of Medicine'
        },
        {
          value: '200',
          type: '>=',
          definition: 'Critical',
          source: 'US National Library of Medicine'
        }
      ],
      chart: {
        list_header: [
          [
            { label: 'Blood Glucose', colspan: 3, class: 'title' }
          ],
          [
            { label: 'Category', colspan: 0, class: '' },
            { label: 'Fasting Values (mg/dl)', colspan: 0, class: '' },
            { label: '2 Hrs Post Meal (mg/dl)', colspan: 0, class: '' }
          ]
        ],
        list_content: [
          { name: 'Normal', class: 'name', data: [{ value: '70- 100', class: 'value' }, { value: '<140', class: 'value' }] },
          { name: 'Pre-Diabetes', class: 'name', data: [{ value: '101- 125', class: 'value' }, { value: '140- 200', class: 'value' }] },
          { name: 'Diabetes', class: 'name', data: [{ value: '126- 199', class: 'value' }, { value: '> 200', class: 'value' }] }
        ]
      },
      description: "Blood Glucose also known as blood sugar is a measure of the amount of glucose (sugar) found in your blood. Glucose is thought to be your body's main source of fuel and is derived from the foods we eat. A high fasting glucose is directly related to type 2 diabetes. Chronically high blood sugar and /or diabetes has adverse affects on your body.",
      alert: 'Your results are associated with a high risk of type 2 diabetes. Because your results are associated with high risk, you are encouraged to contact a BeniComp PULSE health coach or a qualified healthcare provider.'
    },
    bmiValue: {
      name: 'bmiValue',
      biomarker: 'BMI',
      start: 18.5,
      end: 24.9,
      min: 18,
      max: 54,
      ranges: [
        {
          value: '18.5',
          type: '<',
          definition: 'Underweight',
          source: 'US National Library of Medicine'
        }, {
          min: '18.5',
          max: '24.9',
          definition: 'Healthy',
          source: 'US National Library of Medicine'
        },
        {
          min: '25',
          max: '29.9',
          definition: 'Overweight',
          source: 'US National Library of Medicine'
        },
        {
          min: '30',
          max: '39.9',
          definition: 'Obese',
          source: 'US National Library of Medicine'
        },
        {
          value: '40',
          type: '>=',
          definition: 'Extremely Obese',
          source: 'US National Library of Medicine'
        }
      ],
      chart: {
        list_header: [
          [
            { label: 'Body Mass Index (BMI)', colspan: 2, class: 'title' }
          ],
          [
            { label: 'Category', colspan: 0, class: '' },
            { label: 'BMI Measurment', colspan: 0, class: 'category' }
          ]
        ],
        list_content: [
          { name: 'Underweight', class: 'name', data: [{ value: '<18.5', class: 'value' }] },
          { name: 'Healthy', class: 'name', data: [{ value: '18.5 - 24.9', class: 'value' }] },
          { name: 'Overweight', class: 'name', data: [{ value: '25 - 29.9', class: 'value' }] },
          { name: 'Obese', class: 'name', data: [{ value: '30- 39.9', class: 'value' }] },
          { name: 'Extremly Obese', class: 'name', data: [{ value: '>=40', class: 'value' }] }
        ]
      },
      description: "Body Mass Index (BMI) is a weight-to-height ratio. calculated by dividing one's weight in kilograms by the square of one's height in meters. BMI is a tool used as an indicator of underweight and obesity. Typically the higher your BMI is, the greater risk you are of developing diseases associated with obesity such as heart disease and diabetes.",
      alert: 'Your results are associated with a high risk obesity related disease, such as:  heart disease, high blood pressure, type 2 diabetes, gallstones, breathing problems, and certain cancers.  Because your results are associated with high risk, you are encouraged to contact a BeniComp PULSE health coach or a qualified healthcare provider.'
    },
    systolic: {
      name: 'systolic',
      biomarker: 'Systolic Blood Pressure',
      start: 0,
      end: 120,
      sign: 120,
      type: '<=',
      ranges: [
        {
          value: '120',
          type: '<',
          definition: 'Healthy Blood Pressure',
          source: 'US National Library of Medicine'
        }, {
          min: '120',
          max: '139',
          definition: 'Prehypertension',
          source: 'US National Library of Medicine'
        }, {
          min: '140',
          max: '159',
          definition: 'Hypertension Stage I',
          source: 'US National Library of Medicine'
        },
        {
          min: '160',
          max: '180',
          definition: 'Hypertension Stage II',
          source: 'US National Library of Medicine'
        },
        {
          value: '180',
          type: '>',
          definition: 'Hypertensive Crisis',
          source: 'US National Library of Medicine'
        }
      ],
      chart: {
        list_header: [
          [
            { label: 'Systolic Blood Pressure', colspan: 2, class: 'title' }
          ],
          [
            { label: 'Category', colspan: 0, class: '' },
            { label: 'Systolic (Top number) mm/Hg', colspan: 0, class: 'category' }
          ]
        ],
        list_content: [
          { name: 'Healthy Blood Pressure', class: 'name', data: [{ value: '< 120', class: 'value' }] },
          { name: 'Prehypertension', class: 'name', data: [{ value: '120- 139', class: 'value' }] },
          { name: 'Hypertension Stage I', class: 'name', data: [{ value: '140- 159', class: 'value' }] },
          { name: 'Hypertension Stage II', class: 'name', data: [{ value: '>= 160', class: 'value' }] },
          { name: 'Hypertensive Crisis', class: 'name', data: [{ value: '> 180', class: 'value' }] }
        ]
      },
      description: 'Systolic blood pressure is a measurement of the pressure within the arteries when the heart muscle contracts (beats). When reading your blood pressure systolic is the top number, it also happens to be the higher number of the two measurements',
      alert: 'High blood pressure usually has no symptoms. While this is not a diagnosis, your results are associated with serious problems such as stroke, heart failure, heart attack and kidney failure. You are encouraged to contact a BeniComp PULSE health coach or a qualified healthcare provider.'
    },
    diastolic: {
      name: 'diastolic',
      biomarker: 'Diastolic Blood Pressure',
      start: 0,
      end: 80,
      sign: 80,
      type: '<=',
      ranges: [
        {
          value: '80',
          type: '<',
          definition: 'Healthy Blood Pressure',
          source: 'US National Library of Medicine'
        }, {
          min: '80',
          max: '89.99',
          definition: 'Prehypertension',
          source: 'US National Library of Medicine'
        }, {
          min: '90',
          max: '99',
          definition: 'Hypertension Stage I',
          source: 'US National Library of Medicine'
        }, {
          min: '100',
          max: '110',
          definition: 'Hypertension Stage II',
          source: 'US National Library of Medicine'
        },
        {
          value: '110',
          type: '>',
          definition: 'Hypertensive Crisis',
          source: 'US National Library of Medicine'
        }
      ],
      chart: {
        list_header: [
          [
            { label: 'Diastolic Blood Pressure', colspan: 2, class: 'title' }
          ],
          [
            { label: 'Category', colspan: 0, class: '' },
            { label: 'Diastolic (Bottom number) mm/Hg', colspan: 0, class: 'category' }
          ]
        ],
        list_content: [
          { name: 'Healthy blood pressure', class: 'name', data: [{ value: '< 80', class: 'value' }] },
          { name: 'Prehypertension', class: 'name', data: [{ value: '80- 90', class: 'value' }] },
          { name: 'Hypertension Stage I', class: 'name', data: [{ value: '90- 99', class: 'value' }] },
          { name: 'Hypertension Stage II', class: 'name', data: [{ value: '>= 100', class: 'value' }] },
          { name: 'Hypertensive Crisis', class: 'name', data: [{ value: '> 110', class: 'value' }] }
        ]
      },
      description: 'Diastolic blood pressure is a measurement of the pressure in the arteries between muscle contractions (heartbeats). This is when the heart muscle is at rest between beats and refilling with blood. When reading your blood pressure diastolic is the bottom number, it also happens to be the lower of the two measurements.',
      alert: 'High blood pressure usually has no symptoms. While this is not a diagnosis, your results are associated with serious problems such as stroke, heart failure, heart attack and kidney failure. You are encouraged to contact a BeniComp PULSE health coach or a qualified healthcare provider.'
    },
    totChol: {
      name: 'totChol',
      biomarker: 'Total Cholesterol',
      start: 0,
      end: 200,
      ranges: [
        {
          value: '200',
          type: '<',
          definition: 'Desirable',
          source: 'US National Library of Medicine'
        },
        {
          min: '200',
          max: '239.99',
          definition: 'Borderline High',
          source: 'US National Library of Medicine'
        },
        {
          value: '240',
          type: '>=',
          definition: 'High',
          source: 'US National Library of Medicine'
        }
      ],
      chart: {
        list_header: [
          [
            { label: 'Total Cholesterol', colspan: 2, class: 'title' }
          ],
          [
            { label: 'Category', colspan: 0, class: '' },
            { label: 'Total Cholesteral Level mg/dL', colspan: 0, class: 'category' }
          ]
        ],
        list_content: [
          { name: 'Desirable', class: 'name', data: [{ value: '< 200', class: 'value' }] },
          { name: 'Borderline High', class: 'name', data: [{ value: '200 - 239', class: 'value' }] },
          { name: 'High', class: 'name', data: [{ value: '>= 240', class: 'value' }] }
        ]

      },
      description: "Total cholesterol is a measurement of the sum of your blood's cholesterol content. Cholesterol is a waxy substance found in fat (lipid) in your blood and is commonly transported in the blood by lipoproteins. Your body needs cholesterol to build and maintain the integrity of healthy cells.",
      alert: 'Your results are associated with a high risk of atherosclerosis, heart disease, heart attack, and stroke.  Because your results are associated with high risk, you are encouraged to contact a BeniComp PULSE health coach or a qualified healthcare provider.'
    },
    ldl: {
      name: 'ldl',
      biomarker: 'Low-Density Lipoprotein (LDL)',
      start: 0,
      end: 130,
      sign: 130,
      type: '<',
      ranges: [
        {
          value: '100',
          type: '<',
          definition: 'Optimal',
          source: 'US National Library of Medicine'
        }, {
          min: '100',
          max: '129',
          definition: 'Near/above Optimal',
          source: 'US National Library of Medicine'
        },
        {
          min: '130',
          max: '159',
          definition: 'Borderline High',
          source: 'US National Library of Medicine'
        },
        {
          min: '160',
          max: '189',
          definition: 'High',
          source: 'US National Library of Medicine'
        },
        {
          value: '190',
          type: '>=',
          definition: 'Very High',
          source: 'US National Library of Medicine'
        }
      ],
      chart: {
        list_header: [
          [
            { label: 'Low-Density Lipoprotein (LDL)', colspan: 2, class: 'title' }
          ],
          [
            { label: 'Category', colspan: 0, class: '' },
            { label: 'LDL (Bad) Cholesterol Level (mg/dL)', colspan: 0, class: 'category' }
          ]
        ],
        list_content: [
          { name: 'Optimal', class: 'name', data: [{ value: '< 100', class: 'value' }] },
          { name: 'Near/above Optimal', class: 'name', data: [{ value: '100 - 129', class: 'value' }] },
          { name: 'Borderline High', class: 'name', data: [{ value: '130 - 159', class: 'value' }] },
          { name: 'High', class: 'name', data: [{ value: '160 - 189', class: 'value' }] },
          { name: 'Very High', class: 'name', data: [{ value: '>= 190', class: 'value' }] }
        ]
      },
      description: "Low-density lipoprotein (LDL) is a lipoprotein composed of fat (lipid) and protein. It's main function is carry cholesterol and fatty acids (triglycerides) in the blood. LDL carries cholesterol from the liver, through the blood, to the tissues of the body where it is stored.",
      alert: 'While this is not a diagnosis, your results are associated with a high risk of heart disease and stroke. Because your results are associated with high risk, you are encouraged to contact a BeniComp PULSE health coach or a qualified healthcare provider. Associated with high risk, you are encouraged to contact a BeniComp PULSE heath coach or a qualified heathcare provider. Your healthcare provider can help you improve risk factors so you prevent. Metabolic Syndrome in the future.'
    },
    hdl: {
      name: 'hdl',
      biomarker: 'High-Density Lipoprotein (HDL)',
      start: 0,
      end: 60,
      sign: 40,
      type: '>=',
      ranges: [
        {
          value: '40',
          type: '<',
          definition: 'Low, at risk',
          source: 'US National Library of Medicine'
        },
        {
          min: '40',
          max: '59',
          definition: 'Near Optimal',
          source: 'US National Library of Medicine'
        },
        {
          value: '60',
          type: '>',
          definition: 'Optimal',
          source: 'US National Library of Medicine'
        }
      ],
      chart: {
        list_header: [
          [
            { label: 'High-Density Lipoprotein (HDL)', colspan: 2, class: 'title' }
          ],
          [
            { label: 'Category', colspan: 0, class: '' },
            { label: 'HDL (Good) Cholesterol Level (mg/dL)', colspan: 0, class: 'category' }
          ]
        ],
        list_content: [
          { name: 'Low, at risk', class: 'name', data: [{ value: '< 40', class: 'value' }] },
          { name: 'Near Optimal', class: 'name', data: [{ value: '40 - 59', class: 'value' }] },
          { name: 'Optimal', class: 'name', data: [{ value: '>60', class: 'value' }] }
        ]
      },
      description: "High-density lipoprotein (HDL) collects and transports cholesterol around the body, that are not being used by cells and brings them back to the liver to be recycled or destroyed. By doing this, HDL prevents cholesterol from accumulating and clogging arteries.",
      alert: 'Your results are associated with a high risk of heart disease and stroke. Because your results are associated with high risk, you are encouraged to contact a BeniComp PULSE health coach or a qualified healthcare provider.'
    },
    triglycerides: {
      name: 'triglycerides',
      biomarker: 'Triglycerides',
      start: 0,
      end: 150,
      sign: 150,
      type: '<',
      ranges: [
        { value: '150', type: '<', definition: 'Normal', source: 'Mayo Clinic' },
        { min: '150', max: '199', definition: 'Borderline High', source: 'Mayo Clinic' },
        { min: '200', max: '499', definition: 'High', source: 'Mayo Clinic' },
        { value: '500', type: '>=', definition: 'Very High', source: 'Mayo Clinic' }
      ],
      chart: {
        list_header: [
          [
            { label: 'Triglycerides', colspan: 2, class: 'title' }
          ],
          [
            { label: 'Category', colspan: 0, class: '' },
            { label: 'Triglyceride Level (mg/dL)', colspan: 0, class: 'category' }
          ]
        ],
        list_content: [
          { name: 'Normal', class: 'name', data: [{ value: '< 150', class: 'value' }] },
          { name: 'Borderline High', class: 'name', data: [{ value: '150 - 199', class: 'value' }] },
          { name: 'High', class: 'name', data: [{ value: '200 - 499', class: 'value' }] },
          { name: 'Very High', class: 'name', data: [{ value: '>= 500', class: 'value' }] }
        ]
      },
      description: "Triglycerides are a fatty acid that stores energy for later use. These long molecules can be broken down into other fatty acids and glycerol to create fuel for the body. Triglycerides are the result of regularly eating excess calories that your body doesn't need to use right away. Increased levels of triglycerides is associated with and increased risk of heart disease.",
      alert: 'Your results are associated with a high risk of atherosclerosis , pancreatitis, heart attack, and stroke. Because your results are associated with high risk, you are encouraged to contact a BeniComp PULSE health coach or a qualified healthcare provider.'
    },
    creatinine: {
      name: 'creatinine',
      biomarker: 'Creatinine',
      start: 0.6,
      end: 1.3,
      min: 0,
      max: 6,
      ranges: [
        {
          min: '0.6',
          max: '1.3',
          definition: 'Normal',
          source: 'US National Library of Medicine'
        },
        {
          value: '2',
          type: '>',
          definition: 'High',
          source: 'US National Library of Medicine'
        }
      ],
      chart: {
        list_header: [
          [
            { label: 'Creatinine', colspan: 2, class: 'title' }
          ],
          [
            { label: 'Category', colspan: 0, class: '' },
            { label: 'Creatinine Level (mg/dL)', colspan: 0, class: 'category' }
          ]
        ],
        list_content: [
          { name: 'Normal', class: 'name', data: [{ value: '0.6 - 1.3', class: 'value' }] },
          { name: 'High', class: 'name', data: [{ value: '> 2', class: 'value' }] }
        ]
      },
      description: 'This is a measurement of the level of creatinine in your blood. This test is administered to check kidney function. Creatinine is removed from the blood by the kidneys urine. Higher levels may be associated with a kidney dysfunction',
      alert: 'Your results are associated with a high risk of kidney damage. Because your results are associated with high risk, you are encouraged to contact a BeniComp PULSE health coach or a qualified healthcare provider.'
    },
    bun: {
      name: 'bun',
      biomarker: 'BUN',
      start: 6,
      end: 20,
      ranges: [

        {
          min: '6',
          max: '20',
          definition: 'Normal',
          source: 'US National Library of Medicine'
        },
        {
          value: '30',
          type: '>',
          definition: 'High',
          source: 'US National Library of Medicine'
        }
      ],
      chart: {
        list_header: [
          [
            { label: 'Blood Urea Nitrogen (BUN)', colspan: 2, class: 'title' }
          ],
          [
            { label: 'Category', colspan: 0, class: '' },
            { label: 'BUN Levels (mg/dL)', colspan: 0, class: 'category' }
          ]
        ],
        list_content: [
          { name: 'Normal', class: 'name', data: [{ value: '6.0 -20', class: 'value' }] },
          { name: 'High', class: 'name', data: [{ value: '>30', class: 'value' }] }
        ]
      },
      description: 'BUN stands for blood urea nitrogen. Urea nitrogen is what forms when protein is broken down. This test is done to measure the amount of urea nitrogen in your blood to check on kidney function. High bun levels may suggest that the kidneys and/ or liver may not be functioning properly.',
      alert: 'Your results are associated with a high risk of kidney and liver damage. Because your results are associated with high risk, you are encouraged to contact a BeniComp PULSE health coach or a qualified healthcare provider.'
    },
    bilirubin: {
      name: 'bilirubin',
      biomarker: 'Bilirubin',
      start: 0.3,
      end: 1.9,
      sing: 1.9,
      type: '<',
      min: 0,
      max: 3,
      ranges: [
        {
          min: '0.3',
          max: '1.9',
          definition: 'Normal',
          source: 'US National Library of Medicine'
        },
        {
          value: '3',
          type: '>',
          definition: 'High',
          source: 'US National Library of Medicine'
        }
      ],
      chart: {
        list_header: [
          [
            { label: 'Bilirubin', colspan: 2, class: 'title' }
          ],
          [
            { label: 'Category', colspan: 0, class: '' },
            { label: 'Bilirubin Levels (mg/dL)', colspan: 0, class: 'category' }
          ]
        ],
        list_content: [
          { name: 'Normal', class: 'name', data: [{ value: '0.3- 1.9', class: 'value' }] },
          { name: 'High', class: 'name', data: [{ value: '> 3', class: 'value' }] }
        ]
      },
      description: 'Bilirubin is a fluid produced by the liver. Large amounts of bilirubin in the blood can lead to jaundice. Jaundice is a yellow pigmintation in the skin, mucus membrance, or eyes.',
      alert: 'Your results are associated with a high risk of anemia and various gallbladder and  liver diseases, such as gallstones, hepatitis and cirrhosis. Because your results are associated with high risk, you are encouraged to contact a BeniComp PULSE health coach or a qualified healthcare provider.'
    },
    alkaline: {
      name: 'alkaline',
      biomarker: 'ALP',
      start: 20,
      end: 140,
      min: 0,
      max: 400,
      ranges: [
        {
          min: '20',
          max: '140',
          definition: 'Normal',
          source: 'US National Library of Medicine'
        },
        {
          value: '300',
          type: '>',
          definition: 'High',
          source: 'US National Library of Medicine'
        }
      ],
      chart: {
        list_header: [
          [
            { label: 'Alkaline Phosphatase Level (ALP)', colspan: 2, class: 'title' }
          ],
          [
            { label: 'Category', colspan: 0, class: '' },
            { label: 'ALP Levels (IU/L)', colspan: 0, class: 'category' }
          ]
        ],
        list_content: [
          { name: 'Normal', class: 'name', data: [{ value: '20- 140', class: 'value' }] },
          { name: 'High', class: 'name', data: [{ value: '> 300', class: 'value' }] }
        ]
      },
      description: 'Alkaline phosphatase (ALP) is a protein found in all body tissues. Tissues with higher amounts of ALP include the liver, bile ducts and bone. Increased levels of ALP can be a sign of liver or bone disease.',
      alert: 'Your results are associated with a high risk of bonedisease, liver disease and gallbladder disease. Because your results are associated with high risk, you are encouraged to contact a BeniComp PULSE health coach or a qualified healthcare provider.'
    },
    ast: {
      name: 'ast',
      biomarker: 'AST',
      start: 10.0,
      end: 34,
      min: 0,
      max: 120,
      ranges: [
        {
          min: '10.0',
          max: '34',
          definition: 'Normal',
          source: 'US National Library of Medicine'
        },
        {
          value: '100',
          type: '>',
          definition: 'High',
          source: 'US National Library of Medicine'
        }
      ],
      chart: {
        list_header: [
          [
            { label: 'Aspartate Aminotransferase (AST)', colspan: 2, class: 'title' }
          ],
          [
            { label: 'Category', colspan: 0, class: '' },
            { label: 'AST Levels (IU/L)', colspan: 0, class: 'category' }
          ]
        ],
        list_content: [
          { name: 'Normal', class: 'name', data: [{ value: '10.0- 34', class: 'value' }] },
          { name: 'High', class: 'name', data: [{ value: '> 100', class: 'value' }] }
        ]
      },
      description: 'An aspartate aminotransferase (AST) test measures the amount of this enzyme in the blood. AST is normally found in red blood cells, liver, heart, muscle tissue, pancreas, and kidneys.Low levels of AST are normally found in the blood. When body tissue or an organ such as the heart or liver is diseased or damaged, additional AST is released into the bloodstream. The amount of AST in the blood is directly related to the extent of the tissue damage. After severe damage, AST levels rise in 6 to 10 hours and remain high for about 4 days.',
      alert: 'Your results are associated with a high risk of liver disease. Because your results are associated with high risk, you are encouraged to contact a BeniComp PULSE health coach or a qualified healthcare provider.'
    },
    alt: {
      name: 'alt',
      biomarker: 'ALT',
      start: 10.0,
      end: 40,
      min: 0,
      max: 120,
      ranges: [
        {
          min: '10.0',
          max: '40',
          definition: 'Normal',
          source: 'US National Library of Medicine'
        },
        {
          value: '100',
          type: '>',
          definition: 'High',
          source: 'US National Library of Medicine'
        }
      ],
      chart: {
        list_header: [
          [
            { label: 'Alanine Transaminase (ALT)', colspan: 2, class: 'title' }
          ],
          [
            { label: 'Category', colspan: 0, class: '' },
            { label: 'ALT Levels (IU/L)', colspan: 0, class: 'category' }
          ]
        ],
        list_content: [
          { name: 'Normal', class: 'name', data: [{ value: '10.0- 40', class: 'value' }] },
          { name: 'High', class: 'name', data: [{ value: '> 100', class: 'value' }] }
        ]
      },
      description: 'Alanine aminotransferase (ALT) is measured to test if the liver may be damaged or diseased. Low levels of ALT are normally found in the blood. but when the liver is damaged or diseased it releases ALT into the bloodstream. which causes an increase in ALT levels. Most increases in ALT levels are caused by liver damage.',
      alert: 'Your results are associated with a high risk of liver disease.  Because your results are associated with high risk, you are encouraged to contact a BeniComp PULSE health coach or a qualified healthcare provider. You'
    },
    ggt: {
      name: 'ggt',
      biomarker: 'Gamma-Glutamyl Transferase (GGT)',
      isShowValue0: true,
      start: 0,
      end: 65,
      sign: 65,
      type: "<",
      min: 0,
      max: 100,
      ranges: [
        {
          min: '0',
          max: '65',
          definition: 'Normal',
          source: 'US National Library of Medicine'
        }, {
          min: '65',
          max: '75',
          definition: 'Borderline',
          source: 'US National Library of Medicine'
        },
        {
          value: '75',
          type: '>=',
          definition: 'High',
          source: 'US National Library of Medicine'
        },
        {
          value: '100',
          type: '>=',
          definition: 'Critical',
          source: 'US National Library of Medicine'
        }
      ],
      chart: {
        list_header: [
          [
            { label: 'Gamma-Glutamyl Transferase (GGT)', colspan: 2, class: 'title' }
          ],
          [
            { label: 'Category', colspan: 0, class: '' },
            { label: '(GGT) Levels', colspan: 0, class: 'category' }
          ]
        ],
        list_content: [
          { name: 'Normal', class: 'name', data: [{ value: '0 - 65', class: 'value' }] },
          { name: 'Borderline', class: 'name', data: [{ value: '65 - 75', class: 'value' }] },
          { name: 'High', class: 'name', data: [{ value: '≥ 75', class: 'value' }] },
          { name: 'Critical', class: 'name', data: [{ value: '≥ 100', class: 'value' }] }
        ]
      },
      description: "The GGT test is sometimes used to help detect liver disease and bile duct obstructions. It is usually ordered in conjunction with or as follow up to other liver tests such as ALT, AST, ALP, and bilirubin. (Read also about the Liver Panel.) In general, an increased GGT level indicates that a person's liver is being damaged but does not specifically point to a condition that may be causing the injury. GGT can be used to screen for chronic alcohol abuse (it will be elevated in about 75% of chronic drinkers) and to monitor for alcohol use and/or abuse in people who are receiving treatment for alcoholism or alcoholic hepatitis.",
      alert: 'Your results are associated with a high risk of live disease and bile duct disease. Because your results are associated with high risk, you are encouraged to contact a BeniComp PULSE health coach or a qualified healthcare provider.'
    },
    tsh: {
      name: 'tsh',
      biomarker: 'Thyroid Stimulating Hormone (TSH)',
      start: 0.5,
      end: 4.5,
      min: 0,
      max: 6,
      ranges: [
        {
          value: '0.5',
          type: '<',
          definition: 'Low',
          source: 'US National Library of Medicine'
        },
        {
          min: '0.5',
          max: '4.5',
          definition: 'Normal',
          source: 'US National Library of Medicine'
        },
        {
          value: '4.5',
          type: '>',
          definition: 'High',
          source: 'US National Library of Medicine'
        }
      ],
      chart: {
        list_header: [
          [
            { label: 'TSH', colspan: 2, class: 'title' }
          ],
          [
            { label: 'Category', colspan: 0, class: '' },
            { label: 'Levels mU/L', colspan: 0, class: 'category' }
          ]
        ],
        list_content: [
          { name: 'Low', class: 'name', data: [{ value: '< 0.5', class: 'value' }] },
          { name: 'Normal', class: 'name', data: [{ value: '0.5 - 4.5', class: 'value' }] },
          { name: 'High', class: 'name', data: [{ value: '> 4.5', class: 'value' }] }
        ]
      },
      description: "Thyroid Stimulating Hormone (TSH) is released by the pituitary gland and activates the production of two hormones that help control the body's metabolism. This tetst is administered to check for healthy thyroid function.",
      alert: 'Your results are associated with a high risk obesity related disease, such as:  heart disease, high blood pressure, type 2 diabetes, gallstones, breathing problems, and certain cancers.  Because your results are associated with high risk, you are encouraged to contact a BeniComp PULSE health coach or a qualified healthcare provider.'
    },
    gsp: {
      name: 'gsp',
      biomarker: 'GSP',
      start: 0,
      end: 270,
      sign: 270,
      type: "<",
      ranges: [
        {
          value: '270',
          type: '<',
          definition: 'Normal',
          source: 'US National Library of Medicine'
        },
        {
          min: '270',
          max: '350',
          definition: 'High',
          source: 'US National Library of Medicine'
        },
        {
          value: '350',
          type: '>',
          definition: 'Very High',
          source: 'US National Library of Medicine'
        }
      ],
      chart: {
        list_header: [
          [
            { label: 'Fructosamine (GSP)', colspan: 2, class: 'title' }
          ],
          [
            { label: 'Category', colspan: 0, class: '' },
            { label: 'GSP Levels (IU/L)', colspan: 0, class: 'category' }
          ]
        ],
        list_content: [
          { name: 'Normal', class: 'name', data: [{ value: '<270', class: 'value' }] },
          { name: 'High', class: 'name', data: [{ value: '270- 350', class: 'value' }] },
          { name: 'Very High', class: 'name', data: [{ value: '> 350', class: 'value' }] }
        ]
      },
      description: 'GSP (Fructosamine) shows long term blood sugar control in patients with diabetes. GSP is similar to Hemoglobin A1C. It reveals the blood sugar control over 2-3 weeks. If the GSP level is high, the control of sugars were poor. In a diabetic, an improvement in GSP level can show that treatment is effective.',
      alert: 'Your results are associated with a high risk of live disease and bile duct disease. Because your results are associated with high risk, you are encouraged to contact a BeniComp PULSE health coach or a qualified healthcare provider.'
    },
    hemoglobin: {
      name: 'hemoglobin',
      biomarker: 'Hb A1C',
      start: 0,
      end: 5.7,
      min: 0,
      max: 15,
      ranges: [
        {
          value: '5.7',
          type: '<=',
          definition: 'Normal',
          source: 'US National Library of Medicine'
        },
        {
          value: '5.7',
          type: '>',
          definition: 'High',
          source: 'US National Library of Medicine'
        }
      ],
      chart: {
        list_header: [
          [
            { label: 'Hemoglobin A1C (Hb A1C)', colspan: 2, class: 'title' }
          ],
          [
            { label: 'Category', colspan: 0, class: '' },
            { label: 'Albumin Levels (g/dL)', colspan: 0, class: 'category' }
          ]
        ],
        list_content: [
          { name: 'Normal', class: 'name', data: [{ value: '<=5.7', class: 'value' }] },
          { name: 'High', class: 'name', data: [{ value: '>5.7', class: 'value' }] }
        ]
      },
      description: 'Hb A1C (Hemoglobin A1C) is another test to show the control of blood sugars over a period of time. The HbA1C test show the percentage of red blood cells coated in sugar. This can represent the blood sugar averages for 2-3 months.  If there is poor blood sugar control, the treatments being used may not be effective.',
      alert: 'Your results are associated with a high risk of live disease and bile duct disease. Because your results are associated with high risk, you are encouraged to contact a BeniComp PULSE health coach or a qualified healthcare provider.'
    },
    a1c: {
      name: 'a1c',
      biomarker: 'Hb A1C',
      start: 0,
      end: 5.7,
      sign: 5.7,
      type: "<=",
      min: 0,
      max: 10,
      ranges: [
        {
          value: '5.7',
          type: '<=',
          definition: 'Normal',
          source: 'US National Library of Medicine'
        },
        {
          min: '5.71',
          max: '6.49',
          definition: 'Prediabetes',
          source: 'US National Library of Medicine'
        },
        {
          value: '6.5',
          type: '>=',
          definition: 'Diabetes',
          source: 'US National Library of Medicine'
        }
      ],
      chart: {
        list_header: [
          [
            { label: 'Hemoglobin A1C (Hb A1C)', colspan: 2, class: 'title' }
          ],
          [
            { label: 'Category', colspan: 0, class: '' },
            { label: 'Albumin Levels (g/dL)', colspan: 0, class: 'category' }
          ]
        ],
        list_content: [
          { name: 'Normal', class: 'name', data: [{ value: '<=5.7', class: 'value' }] },
          { name: 'Prediabetes', class: 'name', data: [{ value: '>5.7', class: 'value' }] },
          { name: 'Diabetes', class: 'name', data: [{ value: '>=6.5', class: 'value' }] }
        ]
      },
      description: "The Alc test (also known as HbA1c, glycated hemoglobin or glycosylated hemoglobin) is a blood test that correlates with an individual's average blood glucose level over the span of a few months. This test is used as a screening diagnostic test for prediabetes and diabetes.",
      alert: 'Your results are associated with a high risk of live disease and bile duct disease. Because your results are associated with high risk, you are encouraged to contact a BeniComp PULSE health coach or a qualified healthcare provider.'
    },
    protein: {
      name: 'protein',
      biomarker: 'Total Protein',
      start: 6.0,
      end: 8.3,
      min: 0,
      max: 20,
      ranges: [
        {
          min: '6.0',
          max: '8.3',
          definition: 'Normal',
          source: 'US National Library of Medicine'
        },
        {
          value: '8.3',
          type: '>',
          definition: 'High',
          source: 'US National Library of Medicine'
        },
        {
          value: '6',
          type: '<',
          definition: 'Low',
          source: 'US National Library of Medicine'
        }
      ],
      chart: {
        list_header: [
          [
            { label: 'Total Protein', colspan: 2, class: 'title' }
          ],
          [
            { label: 'Category', colspan: 0, class: '' },
            { label: 'Protein Levels (IU/L)', colspan: 0, class: 'category' }
          ]
        ],
        list_content: [
          { name: 'Normal', class: 'name', data: [{ value: '6.0- 8.3', class: 'value' }] },
          { name: 'High', class: 'name', data: [{ value: '> 8.3', class: 'value' }] }
        ]
      },
      description: 'Protein is a measure of the total protein in the blood which is required to perform body functions. The total protein test reveals the total level of both Albumin and Globulin found in the blood. This is an important indicator of the health of the liver as well as nutritional status.',
      alert: 'Although this is not a diagnosis your blood screening shows that your serum protein levels are low. This may be due to liver disease, bleeding (hemorrhaging) or other issues. You are encouraged to contact a BeniComp health coach or a healthcare provider.',
      alert2: 'Although this is not a diagnosis your blood screening shows that your serum protein levels are high. This may be due to inflamation, infection or other health issues. You are encouraged to contact a BeniComp health coach or a healthcare provider.'
    },
    albumin: {
      name: 'albumin',
      biomarker: 'Albumin',
      start: 3.4,
      end: 5.4,
      min: 0,
      max: 10,
      ranges: [
        {
          value: '3.4',
          type: '<',
          definition: 'Low',
          source: 'US National Library of Medicine'
        },
        {
          min: '3.4',
          max: '5.4',
          definition: 'Normal',
          source: 'US National Library of Medicine'
        },
        {
          value: '5.4',
          type: '>',
          definition: 'High',
          source: 'US National Library of Medicine'
        }
      ],
      chart: {
        list_header: [
          [
            { label: 'Albumin', colspan: 2, class: 'title' }
          ],
          [
            { label: 'Category', colspan: 0, class: '' },
            { label: 'Albumin Levels (g/dL)', colspan: 0, class: 'category' }
          ]
        ],
        list_content: [
          { name: 'Normal', class: 'name', data: [{ value: '3.4- 5.4', class: 'value' }] },
          { name: 'High', class: 'name', data: [{ value: '> 5.4', class: 'value' }] }
        ]
      },
      description: 'Albumin is a measure of one of the proteins (albumin) made by the liver. Part of the liver panel test, these proteins are important in fighting infections as well as making sure fluid stays in the bloodstream.  A damaged liver is not able to produce albumin and levels may become low.',
      alert: 'Your results are associated with a high risk of autoimmune disease, cirrhosis and kidney disease. Because your results are associated with high risk, you are encouraged to contact a BeniComp PULSE health coach or a qualified healthcare provider.'
    },
    globulin: {
      name: 'globulin',
      biomarker: 'Globulin',
      start: 2.0,
      end: 3.5,
      min: 0,
      max: 7,
      ranges: [
        {
          min: '2.0',
          max: '3.5',
          definition: 'Normal',
          source: 'US National Library of Medicine'
        },
        {
          value: '3.5',
          type: '>=',
          definition: 'High',
          source: 'US National Library of Medicine'
        }
      ],
      chart: {
        list_header: [
          [
            { label: 'Globulin', colspan: 2, class: 'title' }
          ],
          [
            { label: 'Category', colspan: 0, class: '' },
            { label: 'Globulin Levels (g/dL)', colspan: 0, class: 'category' }
          ]
        ],
        list_content: [
          { name: 'Normal', class: 'name', data: [{ value: '2- 3.5', class: 'value' }] },
          { name: 'High', class: 'name', data: [{ value: '>= 3.5', class: 'value' }] }
        ]
      },
      description: 'Globulin is the other component (along with Albumin) of the total protein test which can help reveal the health of the liver or nutritional status. Globulin levels are helpful in diagnosing a number of different disorders. When differentiated into alpha 1 and 2, beta and gamma, they can help to show inflammation and infection, problems with red blood cells as well as liver disease.',
      alert: 'Your results are associated with a high risk of various health conditions, such as actute infection, bone marrow cancer, chronic inflammatory disease, and  overactive immune system.  Because your results are associated with high risk, you are encouraged to contact a BeniComp PULSE health coach or a qualified healthcare provider.'
    },
    A_G_Ratio: {
      name: 'A_G_Ratio',
      biomarker: 'Albumin/Globulin Ratio',
      start: 1.0,
      end: 3.0,
      min: 0,
      max: 5,
      ranges: [
        {
          value: '1',
          type: '<',
          definition: 'Low',
          source: 'US National Library of Medicine'
        },
        {
          min: '1',
          max: '3',
          definition: 'Normal',
          source: 'US National Library of Medicine'
        },
        {
          value: '3',
          type: '>',
          definition: 'High',
          source: 'US National Library of Medicine'
        }
      ],
      chart: {
        list_header: [
          [
            { label: 'Albumin/Globulin Ratio', colspan: 2, class: 'title' }
          ]
        ],
        list_content: [
          { name: 'Low', class: 'name', data: [{ value: '< 1', class: 'value' }] },
          { name: 'Normal', class: 'name', data: [{ value: '>= 1', class: 'value' }] },
          { name: 'High', class: 'name', data: [{ value: '> 3', class: 'value' }] }
        ]
      },
      description: 'The A/G Ratio (Albumin/Globulin Ratio) test compares the level of albumin to the level of globulin in the blood. The ratio of albumin to globulin can be important in discovering some liver diseases, such as cirrhosis. The A/G ratio can also help show certain kidney problems which may be associated with diabetes.',
      alert: 'alert protein'
    },
    bloodPressure: {
      name: 'bloodPressure',
      biomarker: 'Blood Pressure',
      start: 0,
      end: 1,
      sign: 1,
      type: '>',
      ranges: [
        {
          value: '120/80',
          type: '<',
          definition: 'Healthy Blood Pressure',
          source: 'US National Library of Medicine'
        },
        {
          min: '120/80',
          max: '139/80',
          definition: 'Prehypertension',
          source: 'US National Library of Medicine'
        },
        {
          min: '140/90',
          max: '159/99',
          definition: 'Hypertension Stage I',
          source: 'US National Library of Medicine'
        },
        {
          value: '160/100',
          type: '>=',
          definition: 'Hypertension Stage II',
          source: 'US National Library of Medicine'
        },
        {
          value: '180/110',
          type: '>',
          definition: 'Hypertensive Crisis',
          source: 'US National Library of Medicine'
        }
      ],
      chart: {
        list_header: [
          [
            { label: 'Blood Pressure (BP) What your redings mean!', colspan: 3, class: 'title' }
          ],
          [
            { label: 'Category', colspan: 0, class: '' },
            { label: 'Systolic (Top number) mm/Hg', colspan: 0, class: 'category' },
            { label: 'Diastolic (Bottom number) mm/Hg', colspan: 0, class: 'category' }
          ]
        ],
        list_content: [
          { name: 'Healthy Blood Pressure', class: 'name', data: [{ value: '< 120', class: 'value' }, { value: '< 80', class: 'value' }] },
          { name: 'Prehypertension', class: 'name', data: [{ value: '120- 139', class: 'value' }, { value: '80- 90', class: 'value' }] },
          { name: 'Hypertension Stage I', class: 'name', data: [{ value: '140- 159', class: 'value' }, { value: '90 - 99', class: 'value' }] },
          { name: 'Hypertension Stage II', class: 'name', data: [{ value: '>= 160', class: 'value' }, { value: '>= 100', class: 'value' }] },
          { name: 'Hypertensive Crisis', class: 'name', data: [{ value: '> 180', class: 'value' }, { value: '> 110', class: 'value' }] }
        ]
      },
      description: 'Blood pressure is the force of your blood pushing against the walls of your arteries. Each time your heart beats, it pumps blood throughout your body. The systolic pressure (top number) is the pressure of when your heart is actually beating and the pressure is at its highest. The diastolic pressure (bottom number), is when your heart is at rest between beats and the pressure is at its lowest. These two numbers make up your blood pressure reading.',
      alert: 'High blood pressure usually has no symptoms. While this is not a diagnosis, your results are associated with serious problems such as stroke, heart failure, heart attack and kidney failure. You are encouraged to contact a BeniComp PULSE health coach or a qualified healthcare provider.'
    },
    smokerResponse: {
      name: 'smokerResponse',
      biomarker: 'Nicotine',
      flag: true,
      ranges: [
        {
          definition: ''
        }
      ],
      description: 'Nicotine Use is tested using its primary component, cotinine. This test is typically administered to evaluate tobacco use. Long-term smoking of tobacco products can increase the risk of developing many diseases including lung cancer, COPD, stroke, heart disease, and respiratory infections. Long-term tobacco use may also aggravate asthma and help promote blood clot formation. In pregnant women, tobacco use can impair growth of the developing fetus and lead to low birth wright babies.',
      alert: 'While this is not a diagnosis, your results are associated with an increased risk of serious health problems such as cancer, lung disease, and heart attack. You are encouraged to contact a BeniComp health coach or a qualified healthcare provider. '
    },
    participation: {
      name: 'participation',
      biomarker: 'Participation',
      flag: true,
      ranges: [
        {
          definition: 'Annual health screening is important to everyone. It involves a blood test and biometric measurements to detect disease early, even in people who may look or feel well. This is different from diagnostic tests which are done when someone is already showing signs and/or symptoms of a disease.'
        }
      ],
      description: 'Participation is completely voluntary and health screenings are completely confidential. ',
      alert: 'Early detection, followed by treatment and control of the condition, can result in better outcomes, and lowers the risk of serious complications. It is therefore important to get yourself screened even if you feel perfectly healthy.'
    },
    waistValue: {
      name: 'waistValue',
      biomarker: 'waistValue',
      isHasMultiRanges: false,
      start: 18.5,
      end: 24.9,
      min: 18,
      max: 54,
      ranges: [
        {
          value: '18.5',
          type: '<',
          definition: 'Underweight',
          source: 'US National Library of Medicine'
        }, {
          min: '18.5',
          max: '24.9',
          definition: 'Healthy',
          source: 'US National Library of Medicine'
        },
        {
          min: '25',
          max: '29.9',
          definition: 'Overweight',
          source: 'US National Library of Medicine'
        },
        {
          min: '30',
          max: '39.9',
          definition: 'Obese',
          source: 'US National Library of Medicine'
        },
        {
          value: '40',
          type: '>=',
          definition: 'Extremely Obese',
          source: 'US National Library of Medicine'
        }
      ],
      chart: {
        list_header: [
          [
            { label: 'Waist Circumference:', colspan: 4, class: 'title' }
          ],
          [
            { label: 'Category', colspan: 0, class: '' },
            { label: 'BMI Measurment', colspan: 0, class: 'category' },
            { label: 'Men  ≤ 40 Women  ≤35', colspan: 0, class: 'category' },
            { label: 'Men > 40 Women > 35', colspan: 0, class: 'category' }
          ]
        ],
        list_content: [
          { name: 'Underweight', class: 'name', data: [{ value: '<18.5', class: 'value' }, { value: '', class: 'value' }, { value: '', class: 'value' }] },
          { name: 'Normal Weight', class: 'name', data: [{ value: '18.5 - 24.9', class: 'value' }, { value: '', class: 'value' }, { value: '', class: 'value' }] },
          { name: 'Overweight', class: 'name', data: [{ value: '25 - 29.9', class: 'value' }, { value: 'Increased', class: 'value' }, { value: 'High', class: 'value' }] },
          { name: 'Obese', class: 'name', data: [{ value: '>30', class: 'value' }, { value: 'High', class: 'value' }, { value: 'Very high', class: 'value' }] },
          { name: 'Extremly Obese', class: 'name', data: [{ value: '≥ 40', class: 'value' }, { value: 'Extremly high', class: 'value' }, { value: 'Extremly high', class: 'value' }] }
        ]
      },
      description: 'Measuring waist circumference helps screen for possible health risks that come with overweight and obesity. If most of your fat is around your waist rather than at your hips, you’re at a higher risk for heart disease and type 2 diabetes. This risk goes up with a waist size that is greater than 35 inches for women or greater than 40 inches for men.',
      alert: 'Your results are associated with a high risk obesity related disease, such as:  heart disease, high blood pressure, type 2 diabetes, gallstones, breathing problems, and certain cancers.  Because your results are associated with high risk, you are encouraged to contact a BeniComp PULSE health coach or a qualified healthcare provider.'
    },
    calcium: {
      name: 'calcium',
      biomarker: 'Calcium (Ca)',
      start: 8.5,
      end: 10.1,
      min: 0,
      max: 20,
      ranges: [
        {
          value: '8.4',
          type: '<=',
          definition: 'Low',
          source: 'US National Library of Medicine'
        }, {
          min: '8.5',
          max: '10.1',
          definition: 'Normal',
          source: 'US National Library of Medicine'
        },
        {
          value: '10.2',
          type: '>=',
          definition: 'High',
          source: 'US National Library of Medicine'
        }
      ],
      chart: {
        list_header: [
          [
            { label: 'Calcium (Ca):', colspan: 2, class: 'title' }
          ],
          [
            { label: 'Category', colspan: 0, class: '' },
            { label: '(Ca) Levels mg/dL', colspan: 0, class: 'category' }
          ]
        ],
        list_content: [
          { name: 'Low', class: 'name', data: [{ value: '≤ 8.4', class: 'value' }] },
          { name: 'Normal', class: 'name', data: [{ value: '8.5 - 10.1', class: 'value' }] },
          { name: 'High', class: 'name', data: [{ value: '10.2 - 15', class: 'value' }] }
        ]
      },
      description: 'Calcium helps build strong bones and teeth. All cells need calcium to function properly. Calcium is important for heart function and aids in muscle contraction, nerve signaling and blood clotting. ',
      alert: 'Your results are associated with a high risk obesity related disease, such as:  heart disease, high blood pressure, type 2 diabetes, gallstones, breathing problems, and certain cancers.  Because your results are associated with high risk, you are encouraged to contact a BeniComp PULSE health coach or a qualified healthcare provider.'
    },
    sodium: {
      name: 'sodium',
      biomarker: 'Sodium',
      start: 134,
      end: 146,
      min: 0,
      max: 146,
      ranges: [
        {
          value: '134',
          type: '<',
          definition: 'Low',
          source: 'US National Library of Medicine'
        }, {
          min: '134',
          max: '146',
          definition: 'Normal',
          source: 'US National Library of Medicine'
        },
        {
          value: '147',
          type: '>=',
          definition: 'High',
          source: 'US National Library of Medicine'
        }
      ],
      chart: {
        list_header: [
          [
            { label: 'Sodium:', colspan: 2, class: 'title' }
          ],
          [
            { label: 'Category', colspan: 0, class: '' },
            { label: 'Levels mmol/L', colspan: 0, class: 'category' }
          ]
        ],
        list_content: [
          { name: 'Low', class: 'name', data: [{ value: '≤ 133.9', class: 'value' }] },
          { name: 'Normal', class: 'name', data: [{ value: '134 - 146', class: 'value' }] },
          { name: 'High', class: 'name', data: [{ value: '≥ 147', class: 'value' }] }
        ]
      },
      description: 'Sodium is classified as both an electrolyte and mineral in the body. The main function of sodium is to keep water and other electrolytes in balance. By testing sodium an individual can learn about their hydration status, kidney or adrenal diseases, or even pinpoint the cause of low/high sodium levels within the body.',
      alert: 'Your results are associated with a high risk obesity related disease, such as:  heart disease, high blood pressure, type 2 diabetes, gallstones, breathing problems, and certain cancers.  Because your results are associated with high risk, you are encouraged to contact a BeniComp PULSE health coach or a qualified healthcare provider.'
    },
    potassium: {
      name: 'potassium',
      biomarker: 'Potassium',
      start: 3.6,
      end: 5.1,
      min: 0,
      max: 10,
      ranges: [
        {
          value: '3.6',
          type: '<',
          definition: 'Low',
          source: 'US National Library of Medicine'
        }, {
          min: '3.6',
          max: '5.1',
          definition: 'Normal',
          source: 'US National Library of Medicine'
        },
        {
          value: '5.1',
          type: '>',
          definition: 'High',
          source: 'US National Library of Medicine'
        }
      ],
      chart: {
        list_header: [
          [
            { label: 'Potassium:', colspan: 2, class: 'title' }
          ],
          [
            { label: 'Category', colspan: 0, class: '' },
            { label: 'Levels mmol/L', colspan: 0, class: 'category' }
          ]
        ],
        list_content: [
          { name: 'Low', class: 'name', data: [{ value: '< 3.6', class: 'value' }] },
          { name: 'Normal', class: 'name', data: [{ value: '3.6 - 5.1', class: 'value' }] },
          { name: 'High', class: 'name', data: [{ value: '> 5.1', class: 'value' }] }
        ]
      },
      description: 'Potassium is classified as both an electrolyte and mineral in the body. Potassium\'s main function is to help keep water and other electrolytes in balance. Potassium also plays a role in nerve and muscle function. Testing potassium levels can be an indicator of hydration level.',
      alert: 'Your results are associated with a high risk obesity related disease, such as:  heart disease, high blood pressure, type 2 diabetes, gallstones, breathing problems, and certain cancers.  Because your results are associated with high risk, you are encouraged to contact a BeniComp PULSE health coach or a qualified healthcare provider.'
    },
    carbonDioxide: {
      name: 'carbonDioxide',
      biomarker: 'Carbon Dioxide (CO2)',
      start: 22,
      end: 30,
      min: 0,
      max: 49,
      ranges: [
        {
          value: '22',
          type: '<',
          definition: 'Low',
          source: 'US National Library of Medicine'
        }, {
          min: '22',
          max: '30',
          definition: 'Normal',
          source: 'US National Library of Medicine'
        },
        {
          value: '30',
          type: '>',
          definition: 'High',
          source: 'US National Library of Medicine'
        }
      ],
      chart: {
        list_header: [
          [
            { label: 'Carbon Dioxide (CO2):', colspan: 2, class: 'title' }
          ],
          [
            { label: 'Category', colspan: 0, class: '' },
            { label: '(CO2) Leavels mmol/L', colspan: 0, class: 'category' }
          ]
        ],
        list_content: [
          { name: 'Low', class: 'name', data: [{ value: '≤ 21.9 ', class: 'value' }] },
          { name: 'Normal', class: 'name', data: [{ value: '22 - 30', class: 'value' }] },
          { name: 'High', class: 'name', data: [{ value: '>30', class: 'value' }] }
        ]
      },
      description: 'CO2 blood test measures the amount of carbon dioxide (Co2) in the blood serum, or liquid part of your blood. Your doctor can use this test to determine the imbalance between the oxeygen and carbon dioxide in your blood or pH imbalance in your blood. These imbalances can be signs of a kidney, respiratory or metabolic disorder.',
      alert: 'Your results are associated with a high risk obesity related disease, such as:  heart disease, high blood pressure, type 2 diabetes, gallstones, breathing problems, and certain cancers.  Because your results are associated with high risk, you are encouraged to contact a BeniComp PULSE health coach or a qualified healthcare provider.'
    },
    chloride: {
      name: 'chloride',
      biomarker: 'Chloride (CL)',
      start: 96,
      end: 106,
      min: 0,
      max: 106,
      ranges: [
        {
          value: '96',
          type: '<',
          definition: 'Low',
          source: 'US National Library of Medicine'
        }, {
          min: '96',
          max: '106',
          definition: 'Normal',
          source: 'US National Library of Medicine'
        },
        {
          value: '106',
          type: '>',
          definition: 'High',
          source: 'US National Library of Medicine'
        }
      ],
      chart: {
        list_header: [
          [
            { label: 'Chloride (CL):', colspan: 2, class: 'title' }
          ],
          [
            { label: 'Category', colspan: 0, class: '' },
            { label: '(CL) Levels mmol/L', colspan: 0, class: 'category' }
          ]
        ],
        list_content: [
          { name: 'Low', class: 'name', data: [{ value: '< 96', class: 'value' }] },
          { name: 'Normal', class: 'name', data: [{ value: '96 - 106', class: 'value' }] },
          { name: 'High', class: 'name', data: [{ value: '> 106', class: 'value' }] }
        ]
      },
      description: ' Chloride is a type of electrolyte. It works with other electrolytes such as potassium, sodium, and CO2. These substances keep the proper balance of body fluids and is critical in normal functioning of the muscles, heart and nerves.',
      alert: 'Your results are associated with a high risk obesity related disease, such as:  heart disease, high blood pressure, type 2 diabetes, gallstones, breathing problems, and certain cancers.  Because your results are associated with high risk, you are encouraged to contact a BeniComp PULSE health coach or a qualified healthcare provider.'
    },
    wbc: {
      name: 'wbc',
      biomarker: 'White Blood Cells (WBC)',
      isHasMultiRanges: false,
      start: 3.4,
      end: 10.8,
      min: 0,
      max: 15,
      ranges: [
        {
          value: '3.4',
          type: '<',
          definition: 'Low',
          source: 'US National Library of Medicine'
        }, {
          min: '3.4',
          max: '10.8',
          definition: 'Normal',
          source: 'US National Library of Medicine'
        },
        {
          value: '10.8',
          type: '>',
          definition: 'High',
          source: 'US National Library of Medicine'
        }
      ],
      chart: {
        list_header: [
          [
            { label: 'WBC', colspan: 2, class: 'title' }
          ],
          [
            { label: 'Category', colspan: 0, class: '' },
            { label: 'Levels TH/UL', colspan: 0, class: 'category' }
          ]
        ],
        list_content: [
          { name: 'Low', class: 'name', data: [{ value: '< 3.4', class: 'value' }] },
          { name: 'Normal', class: 'name', data: [{ value: '3.4 - 10.8', class: 'value' }] },
          { name: 'High', class: 'name', data: [{ value: '> 10.8', class: 'value' }] }
        ]
      },
      description: 'White Blood Cells (WBC) are a component of the immune system. They protect the body by finding and destroying threats such as viruses, bad bacteria, and organisms. This test can show you how healthy your immune system is and if your body is currently fighting off any infections.',
      alert: 'Your results are associated with a high risk obesity related disease, such as:  heart disease, high blood pressure, type 2 diabetes, gallstones, breathing problems, and certain cancers.  Because your results are associated with high risk, you are encouraged to contact a BeniComp PULSE health coach or a qualified healthcare provider.'
    },
    rbc: {
      name: 'rbc',
      biomarker: 'Red Blood Cells (RBC)',
      isHasMultiRanges: true,
      start: 4,
      end: 5.2,
      min: 0,
      max: 6,
      minForMale: 0,
      maxForMale: 6,
      startForMale: 4.3,
      endForMale: 5.7,
      ranges: [
        {
          value: '4',
          type: '<',
          definition: 'Low',
          source: 'US National Library of Medicine'
        }, {
          min: '4.0',
          max: '5.2',
          definition: 'Normal',
          source: 'US National Library of Medicine'
        },
        {
          value: '5.2',
          type: '>',
          definition: 'High',
          source: 'US National Library of Medicine'
        }
      ],
      rangesForMale: [
        {
          value: '4.3',
          type: '<',
          definition: 'Low',
          source: 'US National Library of Medicine'
        }, {
          min: '4.3',
          max: '5.7',
          definition: 'Normal',
          source: 'US National Library of Medicine'
        },
        {
          value: '5.7',
          type: '>',
          definition: 'High',
          source: 'US National Library of Medicine'
        }
      ],
      chart: {
        list_header: [
          [
            { label: 'Red Blood Cell (RBC)', colspan: 3, class: 'title' }
          ],
          [
            { label: 'Category', colspan: 0, class: '' },
            { label: 'Levels g/dL', colspan: 2, class: 'category' }
          ],
          [
            { label: '', colspan: 0, class: '' },
            { label: 'Male', colspan: 0, class: 'category' },
            { label: 'Female', colspan: 0, class: 'category' }
          ]
        ],
        list_content: [
          { name: 'Low', class: 'name', data: [{ value: '< 4.3', class: 'value' }, { value: '< 4', class: 'value' }] },
          { name: 'Normal', class: 'name', data: [{ value: '4.3 -5.7', class: 'value' }, { value: '4 -5.2', class: 'value' }] },
          { name: 'High', class: 'name', data: [{ value: '> 5.7', class: 'value' }, { value: '> 5.2', class: 'value' }] }
        ]
      },
      description: 'Red Blood Cells (RBC) are transportation cells. They bring carbon dioxide to the lungs for removal and pick up oxygen to disperse within the body. A red blood ceel test can reveal risk for anemia.',
      alert: 'Your results are associated with a high risk obesity related disease, such as:  heart disease, high blood pressure, type 2 diabetes, gallstones, breathing problems, and certain cancers.  Because your results are associated with high risk, you are encouraged to contact a BeniComp PULSE health coach or a qualified healthcare provider.'
    },
    rdw: {
      name: 'rdw',
      biomarker: 'Red blood cell distribution width (RDW)',
      start: 11.5,
      end: 14.5,
      min: 0,
      max: 25,
      ranges: [
        {
          value: '11.5',
          type: '<',
          definition: 'Low',
          source: 'US National Library of Medicine'
        }, {
          min: '11.5',
          max: '14.5',
          definition: 'Normal',
          source: 'US National Library of Medicine'
        },
        {
          value: '14.5',
          type: '>',
          definition: 'High',
          source: 'US National Library of Medicine'
        }
      ],
      chart: {
        list_header: [
          [
            { label: 'RDW:', colspan: 2, class: 'title' }
          ],
          [
            { label: 'Category', colspan: 0, class: '' },
            { label: 'Levels (%)', colspan: 0, class: 'category' }
          ]
        ],
        list_content: [
          { name: 'Low', class: 'name', data: [{ value: '< 11.5', class: 'value' }] },
          { name: 'Normal', class: 'name', data: [{ value: '11.5 - 14.5', class: 'value' }] },
          { name: 'High', class: 'name', data: [{ value: '> 14.5', class: 'value' }] }
        ]
      },
      description: 'Red blood cell distribution width (RDW) is a measure of the range of variation of red blood cell (RBC) volume that is reported as part of a standard complete blood count. This test can be an indicator anemia.',
      alert: 'Your results are associated with a high risk obesity related disease, such as:  heart disease, high blood pressure, type 2 diabetes, gallstones, breathing problems, and certain cancers.  Because your results are associated with high risk, you are encouraged to contact a BeniComp PULSE health coach or a qualified healthcare provider.'
    },
    mcv: {
      name: 'mcv',
      biomarker: 'Mean Corpuscular Volume (MCV)',
      start: 82,
      end: 98,
      min: 0,
      max: 150,
      ranges: [
        {
          value: '82',
          type: '<',
          definition: 'Low',
          source: 'US National Library of Medicine'
        }, {
          min: '82',
          max: '98',
          definition: 'Normal',
          source: 'US National Library of Medicine'
        },
        {
          value: '98',
          type: '>',
          definition: 'High',
          source: 'US National Library of Medicine'
        }
      ],
      chart: {
        list_header: [
          [
            { label: 'MCV', colspan: 2, class: 'title' }
          ],
          [
            { label: 'Category', colspan: 0, class: '' },
            { label: 'Levels mcc', colspan: 0, class: 'category' }
          ]
        ],
        list_content: [
          { name: 'Low', class: 'name', data: [{ value: '< 82', class: 'value' }] },
          { name: 'Normal', class: 'name', data: [{ value: '82 - 98', class: 'value' }] },
          { name: 'High', class: 'name', data: [{ value: '> 98', class: 'value' }] }
        ]
      },
      description: 'Mean Corpuscular Volume (MCV) measures the size of red blood cells. (i.e. small, medium, large) By examing this test you can learn about the indicators associated with anemia.',
      alert: 'Your results are associated with a high risk obesity related disease, such as:  heart disease, high blood pressure, type 2 diabetes, gallstones, breathing problems, and certain cancers.  Because your results are associated with high risk, you are encouraged to contact a BeniComp PULSE health coach or a qualified healthcare provider.'
    },
    hct: {
      name: 'hct',
      biomarker: 'Hematocrit (Hct)',
      isHasMultiRanges: true,
      start: 34.9,
      end: 44.5,
      min: 0,
      max: 50,
      minForMale: 0,
      maxForMale: 60,
      startForMale: 38.8,
      endForMale: 50,
      ranges: [
        {
          value: '34.9',
          type: '<',
          definition: 'Low',
          source: 'US National Library of Medicine'
        }, {
          min: '34.9',
          max: '44.5',
          definition: 'Normal',
          source: 'US National Library of Medicine'
        },
        {
          value: '44.5',
          type: '>',
          definition: 'High',
          source: 'US National Library of Medicine'
        }
      ],
      rangesForMale: [
        {
          value: '38.8',
          type: '<',
          definition: 'Low',
          source: 'US National Library of Medicine'
        }, {
          min: '38.8',
          max: '50',
          definition: 'Normal',
          source: 'US National Library of Medicine'
        },
        {
          value: '50',
          type: '>',
          definition: 'High',
          source: 'US National Library of Medicine'
        }
      ],
      chart: {
        list_header: [
          [
            { label: 'Hematocrit (Hct)', colspan: 3, class: 'title' }
          ],
          [
            { label: 'Category', colspan: 0, class: '' },
            { label: '%', colspan: 2, class: 'category' }
          ],
          [
            { label: '', colspan: 0, class: '' },
            { label: 'Male', colspan: 0, class: 'category' },
            { label: 'Female', colspan: 0, class: 'category' }
          ]
        ],
        list_content: [
          { name: 'Low', class: 'name', data: [{ value: '< 38.8', class: 'value' }, { value: '< 34.9', class: 'value' }] },
          { name: 'Normal', class: 'name', data: [{ value: '38.8 - 50', class: 'value' }, { value: '34.9 - 44.5', class: 'value' }] },
          { name: 'High', class: 'name', data: [{ value: '> 50', class: 'value' }, { value: '> 44.5', class: 'value' }] }
        ]
      },
      description: 'Hematocrit (Hct) is a proportional value of red blood cells in a sample (i.e. 39% of blood volume is red blood cells). By testing for hematocrit an individual can learn their risk for developing anemia.',
      alert: 'Your results are associated with a high risk obesity related disease, such as:  heart disease, high blood pressure, type 2 diabetes, gallstones, breathing problems, and certain cancers.  Because your results are associated with high risk, you are encouraged to contact a BeniComp PULSE health coach or a qualified healthcare provider.'
    },
    mch: {
      name: 'mch',
      biomarker: 'Mean Corpuscular Hemoglobin (MCH)',
      start: 27,
      end: 33,
      min: 0,
      max: 34,
      ranges: [
        {
          value: '27',
          type: '<',
          definition: 'Low',
          source: 'US National Library of Medicine'
        }, {
          min: '27',
          max: '33',
          definition: 'Normal',
          source: 'US National Library of Medicine'
        },
        {
          value: '34',
          type: '>=',
          definition: 'High',
          source: 'US National Library of Medicine'
        }
      ],
      chart: {
        list_header: [
          [
            { label: 'Mean Corpuscualr Hemoglobin (MCH):', colspan: 2, class: 'title' }
          ],
          [
            { label: 'Category', colspan: 0, class: '' },
            { label: 'MCH Levels pg/cell', colspan: 0, class: 'category' }
          ]
        ],
        list_content: [
          { name: 'Low', class: 'name', data: [{ value: '≤ 26', class: 'value' }] },
          { name: 'Normal', class: 'name', data: [{ value: '27 - 33', class: 'value' }] },
          { name: 'High', class: 'name', data: [{ value: '≥ 34', class: 'value' }] }
        ]
      },
      description: 'Mean Corpuscular Hemoglobin (MCH) is a calculation of the average amount of hemoglobin contained within each of an individuals red blood cells. Abnormally high or low levels of MCH, can be an indication of a number of complications within the body from nutrient deficiencies to chronic disease.',
      alert: 'Your results are associated with a high risk obesity related disease, such as:  heart disease, high blood pressure, type 2 diabetes, gallstones, breathing problems, and certain cancers.  Because your results are associated with high risk, you are encouraged to contact a BeniComp PULSE health coach or a qualified healthcare provider.'
    },
    mchc: {
      name: 'mchc',
      biomarker: 'Mean Corpuscular Hemoglobin Concentration (MCHC)',
      start: 33,
      end: 36,
      min: 0,
      max: 60,
      ranges: [
        {
          value: '33',
          type: '<',
          definition: 'Low',
          source: 'US National Library of Medicine'
        }, {
          min: '33',
          max: '36',
          definition: 'Normal',
          source: 'US National Library of Medicine'
        },
        {
          value: '36',
          type: '>',
          definition: 'High',
          source: 'US National Library of Medicine'
        }
      ],
      chart: {
        list_header: [
          [
            { label: 'MCHC', colspan: 2, class: 'title' }
          ],
          [
            { label: 'Category', colspan: 0, class: '' },
            { label: 'Levels g/dL', colspan: 0, class: 'category' }
          ]
        ],
        list_content: [
          { name: 'Low', class: 'name', data: [{ value: '< 33', class: 'value' }] },
          { name: 'Normal', class: 'name', data: [{ value: '33 - 36', class: 'value' }] },
          { name: 'High', class: 'name', data: [{ value: '> 36', class: 'value' }] }
        ]
      },
      description: 'Mean Corpuscular Hemoglobin Concentration (MCHC) is a measure of the concentration of hemoglobin in a given volume of packed red blood cells. Abnormally high or low levels of MCHC, can be an indication of a number of complications within the body from nutrient deficiencies to chronic disease.',
      alert: 'Your results are associated with a high risk obesity related disease, such as:  heart disease, high blood pressure, type 2 diabetes, gallstones, breathing problems, and certain cancers.  Because your results are associated with high risk, you are encouraged to contact a BeniComp PULSE health coach or a qualified healthcare provider.'
    },
    platelets: {
      name: 'platelets',
      biomarker: 'Platelet (Plt)',
      start: 150,
      end: 450,
      min: 0,
      max: 500,
      ranges: [
        {
          value: '150',
          type: '<',
          definition: 'Low',
          source: 'US National Library of Medicine'
        }, {
          min: '150',
          max: '450',
          definition: 'Normal',
          source: 'US National Library of Medicine'
        },
        {
          value: '450',
          type: '>',
          definition: 'High',
          source: 'US National Library of Medicine'
        }
      ],
      chart: {
        list_header: [
          [
            { label: 'Platelet (Plt)', colspan: 2, class: 'title' }
          ],
          [
            { label: 'Category', colspan: 0, class: '' },
            { label: 'Levels TH/UL', colspan: 0, class: 'category' }
          ]
        ],
        list_content: [
          { name: 'Low', class: 'name', data: [{ value: '< 150', class: 'value' }] },
          { name: 'Normal', class: 'name', data: [{ value: '150 - 450', class: 'value' }] },
          { name: 'High', class: 'name', data: [{ value: '> 450', class: 'value' }] }
        ]
      },
      description: "Platelets are the smallest blood cell type. Their function is help halt blood loss by forming blood clots. This test can show us your body's ability to form clots.",
      alert: 'Your results are associated with a high risk obesity related disease, such as:  heart disease, high blood pressure, type 2 diabetes, gallstones, breathing problems, and certain cancers.  Because your results are associated with high risk, you are encouraged to contact a BeniComp PULSE health coach or a qualified healthcare provider.'
    },
    psa: {
      name: 'psa',
      biomarker: 'Prostate-Specific Antigen (PSA)',
      isShowValue0: true,
      start: 0,
      end: 4,
      min: 0,
      max: 4,
      ranges: [
        {
          min: '0',
          max: '4',
          definition: 'Normal',
          source: 'US National Library of Medicine'
        },
        {
          value: '4',
          type: '>',
          definition: 'High',
          source: 'US National Library of Medicine'
        }
      ],
      chart: {
        list_header: [
          [
            { label: 'Prostate-Specific Antigen (PSA)', colspan: 2, class: 'title' }
          ],
          [
            { label: 'Category', colspan: 0, class: '' },
            { label: 'Levels ng/mL', colspan: 0, class: 'category' }
          ]
        ],
        list_content: [
          { name: 'Normal', class: 'name', data: [{ value: '0 - 4', class: 'value' }] },
          { name: 'High', class: 'name', data: [{ value: '> 4', class: 'value' }] }
        ]
      },
      description: "Prostate-Specific Antigen (PSA) is a substance produced by the prostate gland. PSA's main function is to be an indicator of prostate issues. This test is administered to male participants to to make them aware of the risk factors associated with prostate health.",
      alert: 'Your results are associated with a high risk obesity related disease, such as:  heart disease, high blood pressure, type 2 diabetes, gallstones, breathing problems, and certain cancers.  Because your results are associated with high risk, you are encouraged to contact a BeniComp PULSE health coach or a qualified healthcare provider.'
    },
    crp: {
      name: 'crp',
      biomarker: 'C-Reactive Protien (CRP)',
      start: 1,
      end: 3,
      min: 0,
      max: 6,
      ranges: [
        {
          value: '1',
          type: '<',
          definition: 'Low',
          source: 'US National Library of Medicine'
        },
        {
          min: '1',
          max: '3',
          definition: 'Normal',
          source: 'US National Library of Medicine'
        },
        {
          value: '3',
          type: '>',
          definition: 'High',
          source: 'US National Library of Medicine'
        }
      ],
      chart: {
        list_header: [
          [
            { label: 'CRP', colspan: 2, class: 'title' }
          ],
          [
            { label: 'Category', colspan: 0, class: '' },
            { label: 'Levels mg/dL', colspan: 0, class: 'category' }
          ]
        ],
        list_content: [
          { name: 'Low Risk', class: 'name', data: [{ value: '< 1.0', class: 'value' }] },
          { name: 'Normal', class: 'name', data: [{ value: '1.0 - 3.0', class: 'value' }] },
          { name: 'High risk', class: 'name', data: [{ value: '> 3.0', class: 'value' }] }
        ]
      },
      description: "C-Reactive Protien (CRP) is a substance produced by the liver in response to inflammation. A high level of CRP in the blood is a marker of any condition that causes inflammation, from upper respiratory infection to cancer. High CRP levels can indicate that there is inflammation in the arteries of the heart, which can mean a greater risk for heart attack. It is important to note that CRP is a nonspecific test and can be elevated in any inflammatory condition.",
      alert: 'Your results are associated with a high risk obesity related disease, such as:  heart disease, high blood pressure, type 2 diabetes, gallstones, breathing problems, and certain cancers.  Because your results are associated with high risk, you are encouraged to contact a BeniComp PULSE health coach or a qualified healthcare provider.'
    },
    gfrBlack: {
      name: 'gfrBlack',
      biomarker: 'Estimated Glomerular Filtration Rate (eGFR)',
      start: 0,
      end: 60,
      sign: 60,
      type: ">=",
      ranges: [
        {
          value: '15',
          type: '<',
          definition: 'Kidney failure',
          source: 'US National Library of Medicine'
        },
        {
          min: '15',
          max: '29',
          definition: 'Severely Decreased',
          source: 'US National Library of Medicine'
        },
        {
          min: '30',
          max: '59',
          definition: 'Moderately decreased',
          source: 'US National Library of Medicine'
        },
        {
          value: '60',
          type: '>=',
          definition: 'Normal',
          source: 'US National Library of Medicine'
        }
      ],
      chart: {
        list_header: [
          [
            { label: 'Glomerular Filtarition Rate (GFR)', colspan: 2, class: 'title' }
          ],
          [
            { label: 'Category', colspan: 0, class: '' },
            { label: '(GFR) Levels', colspan: 0, class: 'category' }
          ]
        ],
        list_content: [
          { name: 'Normal', class: 'name', data: [{ value: '≥ 60', class: 'value' }] },
          { name: 'Moderately decreased', class: 'name', data: [{ value: '30 - 59', class: 'value' }] },
          { name: 'Severely Decreased', class: 'name', data: [{ value: '15 - 29', class: 'value' }] },
          { name: 'Kidney failure', class: 'name', data: [{ value: '< 15', class: 'value' }] }
        ]
      },
      description: 'Estimated Glomerular filtration rate (eGFR) is the best test to measure your level of kidney function. Your doctor can calculate it from the results of your blood creatinine test, your age, body size and gender.',
      alert: 'Your results are associated with a high risk of live disease and bile duct disease. Because your results are associated with high risk, you are encouraged to contact a BeniComp PULSE health coach or a qualified healthcare provider.'
    },

    heightzz: {
      name: 'heightzz',
      biomarker: 'Height',
      start: 0,
      end: 10,
      ranges: [],
      description: 'description height',
      alert: 'alert height'
    },
    weightzz: {
      name: 'weightzz',
      biomarker: 'Weight',
      start: 0,
      end: 10,
      ranges: [],
      description: 'description weight',
      alert: 'alert weight'
    }
  })

  .constant('REGISTRATION_STATUS', {
    register: 0,
    hra: 1,
    schedule: 2,
    completed: 3,
    editRegister: 4,
    editHra: 5
  })

  .constant('BIOMARKERS', {
    healthResults: [
      {
        'name': 'Height',
        'title': 'Height',
        'value': 'height'
      },
      {
        'name': 'Weight',
        'title': 'Weight',
        'value': 'weight'
      },
      {
        'name': 'Waist Circ',
        'title': 'Waist Circ',
        'value': 'waist'
      },
      {
        'name': 'BMI-Value',
        'title': 'BMI',
        'value': 'bmiValue'
      },
      {
        'name': 'Calc BMI',
        'title': 'Calc BMI',
        'value': 'calcBmi'
      },
      {
        'name': 'Systolic1',
        'title': 'BPSyst1',
        'value': 'systolic1'
      },
      {
        'name': 'Diastolic 1',
        'title': 'BPDias1',
        'value': 'diastolic1'
      },
      {
        'name': 'Systolic2',
        'title': 'BPSyst2',
        'value': 'systolic2'
      },
      {
        'name': 'Diastolic 2',
        'title': 'BPDias2',
        'value': 'diastolic2'
      },
      {
        'name': 'Cotinine',
        'title': 'Cotinine',
        'value': 'serumContine'
      },
      {
        'name': 'Smoker Response',
        'title': 'Smoker Response',
        'value': 'smokerResponse'
      },
      {
        'name': 'Glucose',
        'title': 'BLOOD GLUCOSE',
        'value': 'glucose'
      },
      {
        'name': 'A1C',
        'title': 'A1C',
        'value': 'a1c'
      },
      {
        'name': 'GSP',
        'title': 'GSP',
        'value': 'gsp'
      },
      {
        'name': 'Tot Chol',
        'title': 'Tot Chol',
        'value': 'totChol'
      },
      {
        'name': 'HDL',
        'title': 'HDL',
        'value': 'hdl'
      },
      {
        'name': 'LDL',
        'title': 'LDL',
        'value': 'ldl'
      },
      {
        'name': 'Trig',
        'title': 'TRIGLYCERIDES',
        'value': 'triglycerides'
      },
      {
        'name': 'CHOL/HDL Ratio',
        'title': 'CHOL/HDL Ratio',
        'value': 'cholHdlRatio'
      },
      {
        'name': 'LDLHDHR Ratio',
        'title': 'LDLHDR RATIO',
        'value': 'ldlhdhrRatio'
      },
      {
        'name': 'BUN',
        'title': 'BUN',
        'value': 'bun'
      },
      {
        'name': 'Creatinine',
        'title': 'Creatinine',
        'value': 'creatinine'
      },
      {
        'name': 'Alkaline',
        'title': 'Alkaline',
        'value': 'alkaline'
      },
      {
        'name': 'Bilirubin',
        'title': 'Bilirubin',
        'value': 'bilirubin'
      },
      {
        'name': 'AST',
        'title': 'AST',
        'value': 'ast'
      },
      {
        'name': 'ALT',
        'title': 'ALT',
        'value': 'alt'
      },
      {
        'name': 'GGT',
        'title': 'GGT',
        'value': 'ggt'
      },
      {
        'name': 'TSH',
        'title': 'TSH',
        'value': 'tsh'
      },
      {
        'name': 'Total Protein',
        'title': 'Total Protein',
        'value': 'protein'
      },
      {
        'name': 'Albumin',
        'title': 'Albumin',
        'value': 'albumin'
      },
      {
        'name': 'Globulin',
        'title': 'Globulin',
        'value': 'globulin'
      },
      {
        'name': 'ALB/GLO Ratio',
        'title': 'ALB/GLO Ratio',
        'value': 'alb'
      },
      {
        'name': 'Calcium',
        'title': 'Calcium',
        'value': 'calcium'
      },
      {
        'name': 'Sodium',
        'title': 'Sodium',
        'value': 'sodium'
      },
      {
        'name': 'Potassium',
        'title': 'Potassium',
        'value': 'potassium'
      },
      {
        'name': 'Carbon Dioxide',
        'title': 'Carbon Dioxide',
        'value': 'carbonDioxide'
      },
      {
        'name': 'Chloride',
        'title': 'Chloride',
        'value': 'chloride'
      },
      {
        'name': 'White Blood',
        'title': 'White Blood',
        'value': 'wbc'
      },
      {
        'name': 'Red Blood',
        'title': 'Red Blood',
        'value': 'rbc'
      },
      {
        'name': 'Hematocrit',
        'title': 'Hematocrit',
        'value': 'hct'
      },
      {
        'name': 'MCV',
        'title': 'MCV',
        'value': 'mcv'
      },
      {
        'name': 'MCH',
        'title': 'MCH',
        'value': 'mch'
      },
      {
        'name': 'MCHC',
        'title': 'MCHC',
        'value': 'mchc'
      },
      {
        'name': 'RDW',
        'title': 'RDW',
        'value': 'rdw'
      },
      {
        'name': 'Platelets',
        'title': 'Platelets',
        'value': 'platelets'
      },
      {
        'name': 'PSA',
        'title': 'PSA',
        'value': 'psa'
      },
      {
        'name': 'CRP',
        'title': 'CRP',
        'value': 'crp'
      },
      {
        'name': 'eGFR Black',
        'title': 'eGFR Black',
        'value': 'gfrBlack'
      },
      {
        'name': 'eGFR NON Black',
        'title': 'eGFR NON Black',
        'value': 'gfrNonBlack'
      },



      /*{
       'name': 'BodyFat',
       'value': 'bodyFat'
       },
       {
       'name': 'Waist',
       'value': 'waist'
       },
       {
       'name': 'Hip',
       'value': 'hip'
       },
       {
       'name': 'BPDValue1',
       'value': 'bpdValue1'
       },
       {
       'name': 'BPSValue1',
       'value': 'bpsValue1'
       },
       {
       'name': 'BPDValue1',
       'value': 'bpdValue1'
       },
       {
       'name': 'BPSValue2',
       'value': 'bpdValue2'
       },
       {
       'name': 'ALB',
       'value': 'alb'
       },
       {
       'name': 'PSA',
       'value': 'psa'
       },
       {
       'name': 'WhiteBlood',
       'value': 'whiteBlood'
       },
       {
       'name': 'RedBlood',
       'value': 'redBlood'
       },
       {
       'name': 'MeanCorpVol',
       'value': 'meanCorpVol'
       },
       {
       'name': 'MeanCorpHem',
       'value': 'meanCorpHem'
       },
       {
       'name': 'MeanCorpHemCo',
       'value': 'meanCorpHemCo'
       },
       {
       'name': 'GSP',
       'value': 'gsp'
       },
       {
       'name': 'T4',
       'value': 't4'
       },
       {
       'name': 'HsCRP',
       'value': 'hscrp'
       },
       {
       'name': 'NTproBNP',
       'value': 'nTproBNP'
       },

       {
       'name': 'Homocysteine',
       'value': 'homocysteine'
       },
       {
       'name': 'Lipoprotein',
       'value': 'lipoprotein'
       }*/
    ],
    metabolicSyndrome: [
      {
        'name': 'Waist Circ',
        'title': 'Waist Circ',
        'statusHS': 'metapolicSyndromeWaist',
        'value': 'waist'
      },
      {
        'name': 'Blood Pressure',
        'title': 'Blood Pressure',
        'statusHS': 'metapolicSyndromeBloodPressure',
        'value': 'bloodpressure'
      },
      {
        'name': 'Glucose',
        'title': 'BLOOD GLUCOSE',
        'statusHS': 'metapolicSyndromeBloodSugar',
        'value': 'glucose'
      },
      {
        'name': 'Trig',
        'title': 'TRIGLYCERIDES',
        'statusHS': 'metapolicSyndromeTriglycerides',
        'value': 'triglycerides'
      },
      {
        'name': 'HDL',
        'title': 'HDL',
        'statusHS': 'metapolicSyndromeHdl',
        'value': 'hdl'
      }

    ]
  })

  .constant('INCENTIVE_DEFAULTS', {
    incentiveParams: {
      startDate: new Date(new Date().getFullYear() + 1, 0, 1),
      endDate: new Date(new Date().getFullYear() + 1, 11, 31),
      registerStartDate: new Date(new Date().getFullYear() + 1, 0, 1),
      registerEndDate: new Date(new Date().getFullYear() + 1, 0, 15),
      plans: {},
      targetsOption: 0,
      bodyMassIndexReward: { goal: 24.9, singleAmount: 400, familyAmount: 800, typesTime: 1 },
      bloodSugarReward: { goal: 100, singleAmount: 400, familyAmount: 800, typesTime: 1 },
      nicotinUseReward: { goal: 'No', singleAmount: 400, familyAmount: 800, typesTime: 1 },
      healthCoachingReward: { goal: 'Yes', singleAmount: 400, familyAmount: 800, typesTime: 1 },
      bloodPressureReward: { systolicGoal: 120, diastolicGoal: 80, singleAmount: 400, familyAmount: 800, typesTime: 1 },
      ldlCholesterolReward: { goal: 100, singleAmount: 400, familyAmount: 800, typesTime: 1 },
      participationReward: { goal: 'Yes', singleAmount: 400, familyAmount: 800, typesTime: 1 },
      healthRiskAssessmentReward: { goal: 'Yes', singleAmount: 400, familyAmount: 800, typesTime: 1 },
      a1cReward: { goal: 5.7, singleAmount: 400, familyAmount: 800, typesTime: 1 },
      waistCircumferenceReward: { goalMale: 40, goalFemale: 35, singleAmount: 400, familyAmount: 800, typesTime: 1 },
    }
  })

  .constant('REGISTRATION_CLOSE_MESSAGE', 'If you have any issues or concerns, please use our contact form or call 866-797-3343');