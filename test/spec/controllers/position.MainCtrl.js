'use strict';

var mockupCompanyFactory =
    {
        companyObject:
        {
            "id": 1,
            "companyName": "Test Company",
            "industry": "Mining",
            "addr": "1 Frederick street",
            "postcode": 6104,
            "state": "WA",
            "description": null,
            "latitude": null,
            "longitude": null,
            "country": "Australia",
            "resultEmail": "phuong_thql@yahoo.com",
            "invoiceEmail": "phuong_thql@yahoo.com",
            "poNumber": "2",
            "isproject": 0,
            "iscalendar": null,
            "fatherId": null,
            "reportToEmail": "phuong_thql@yahoo.com",
            "defaultStatus": "Confirmed",
            "isinvoiceemailtouser": 0,
            "createdBy": null,
            "creationDate": null,
            "lastUpdatedBy": 3,
            "lastUpdateDate": "2015-03-18T16:31:33.000Z",
            "isaddcontactemailtoresult": 0,
            "ima": null,
            "siteName": null,
            "medicContactNo": null,
            "email": null,
            "code": null,
            "insurer": null,
            "phone": null,
            "siteMedic": null,
            "userId": null,
            "ispo": 0,
            "isextra": 1,
            "subsidiaries": [
                {
                    "id": 14,
                    "companyName": "Site 1",
                    "industry": null,
                    "addr": null,
                    "postcode": null,
                    "state": null,
                    "description": null,
                    "latitude": null,
                    "longitude": null,
                    "country": null,
                    "resultEmail": "phuong_thql@yahoo.com",
                    "invoiceEmail": "phuong_thql@yahoo.com",
                    "poNumber": "21",
                    "isproject": null,
                    "iscalendar": null,
                    "fatherId": 1,
                    "reportToEmail": null,
                    "defaultStatus": null,
                    "isinvoiceemailtouser": null,
                    "createdBy": 3,
                    "creationDate": "2013-12-10T10:58:50.000Z",
                    "lastUpdatedBy": 3,
                    "lastUpdateDate": "2015-03-18T16:31:55.000Z",
                    "isaddcontactemailtoresult": null,
                    "ima": null,
                    "siteName": null,
                    "medicContactNo": null,
                    "email": null,
                    "code": null,
                    "insurer": null,
                    "phone": null,
                    "siteMedic": null,
                    "userId": null,
                    "ispo": null,
                    "isextra": 0,
                    "$$hashKey": "object:137"
                },
                {
                    "id": 15,
                    "companyName": "Site 2",
                    "industry": null,
                    "addr": null,
                    "postcode": null,
                    "state": null,
                    "description": null,
                    "latitude": null,
                    "longitude": null,
                    "country": null,
                    "resultEmail": "phuong_thql@yahoo.com",
                    "invoiceEmail": "phuong_thql@yahoo.com",
                    "poNumber": "22",
                    "isproject": null,
                    "iscalendar": null,
                    "fatherId": 1,
                    "reportToEmail": null,
                    "defaultStatus": null,
                    "isinvoiceemailtouser": null,
                    "createdBy": 3,
                    "creationDate": "2013-12-10T10:59:07.000Z",
                    "lastUpdatedBy": 3,
                    "lastUpdateDate": "2015-03-18T16:31:55.000Z",
                    "isaddcontactemailtoresult": null,
                    "ima": null,
                    "siteName": null,
                    "medicContactNo": null,
                    "email": null,
                    "code": null,
                    "insurer": null,
                    "phone": null,
                    "siteMedic": null,
                    "userId": null,
                    "ispo": null,
                    "isextra": 0,
                    "$$hashKey": "object:138"
                }
            ],
            "packages": [
                {
                    "id": 36,
                    "packageName": "General Assessments.",
                    "companyId": 1,
                    "createdBy": 1,
                    "creationDate": "2013-12-10T11:00:28.000Z",
                    "lastUpdatedBy": 1,
                    "lastUpdateDate": "2014-01-15T08:27:11.000Z",
                    "itemId": null,
                    "itemCode": null,
                    "itemName": null,
                    "fee": 150,
                    "AssessmentHeaders": [
                        {
                            "id": "20000000036",
                            "packId": 36,
                            "assHeaderId": 2,
                            "headerName": "FUNCTION CAPACITY ASSESSMENT",
                            "Assessments": [
                                {
                                    "id": "20000000036",
                                    "packId": 36,
                                    "assHeaderId": 2,
                                    "assId": 2,
                                    "headerName": "FUNCTION CAPACITY ASSESSMENT",
                                    "assName": "Job-specific functional capacity/musculoskeletal assessment (PMMMSA)"
                                }
                            ]
                        }
                    ],
                    "$$hashKey": "object:139"
                },
                {
                    "id": 77,
                    "packageName": "Lab DAS only",
                    "companyId": 1,
                    "createdBy": 1,
                    "creationDate": "2014-04-14T09:31:51.000Z",
                    "lastUpdatedBy": 1,
                    "lastUpdateDate": "2014-04-14T09:33:34.000Z",
                    "itemId": null,
                    "itemCode": null,
                    "itemName": null,
                    "fee": 45,
                    "AssessmentHeaders": [
                        {
                            "id": "30000000077",
                            "packId": 77,
                            "assHeaderId": 3,
                            "headerName": "DAS",
                            "Assessments": [
                                {
                                    "id": "30000000077",
                                    "packId": 77,
                                    "assHeaderId": 3,
                                    "assId": 3,
                                    "headerName": "DAS",
                                    "assName": "Lab drug and alcohol test (PMDAS)"
                                }
                            ]
                        }
                    ],
                    "$$hashKey": "object:140"
                },
                {
                    "id": 80,
                    "packageName": "Pre-employment Medical Assessment",
                    "companyId": 1,
                    "createdBy": 1,
                    "creationDate": "2014-04-14T12:56:49.000Z",
                    "lastUpdatedBy": 1,
                    "lastUpdateDate": "2014-04-14T12:57:56.000Z",
                    "itemId": null,
                    "itemCode": null,
                    "itemName": null,
                    "fee": 235,
                    "AssessmentHeaders": [
                        {
                            "id": "10000000080",
                            "packId": 80,
                            "assHeaderId": 1,
                            "headerName": "MEDICAL",
                            "Assessments": [
                                {
                                    "id": "10000000080",
                                    "packId": 80,
                                    "assHeaderId": 1,
                                    "assId": 1,
                                    "headerName": "MEDICAL",
                                    "assName": "Standard Medical Assessment ( including Height, Weight, BP, BMI, vision, urinalysis and GP review) (PMMA)"
                                }
                            ]
                        },
                        {
                            "id": "30000000080",
                            "packId": 80,
                            "assHeaderId": 3,
                            "headerName": "DAS",
                            "Assessments": [
                                {
                                    "id": "30000000080",
                                    "packId": 80,
                                    "assHeaderId": 3,
                                    "assId": 3,
                                    "headerName": "DAS",
                                    "assName": "Lab drug and alcohol test (PMDAS)"
                                }
                            ]
                        },
                        {
                            "id": "50000000080",
                            "packId": 80,
                            "assHeaderId": 5,
                            "headerName": "STANDARD AUDIO",
                            "Assessments": [
                                {
                                    "id": "50000000080",
                                    "packId": 80,
                                    "assHeaderId": 5,
                                    "assId": 10,
                                    "headerName": "STANDARD AUDIO",
                                    "assName": "WorkCover Audiometry (PMAUD)"
                                }
                            ]
                        },
                        {
                            "id": "60000000080",
                            "packId": 80,
                            "assHeaderId": 6,
                            "headerName": "SPIROMETRY",
                            "Assessments": [
                                {
                                    "id": "60000000080",
                                    "packId": 80,
                                    "assHeaderId": 6,
                                    "assId": 12,
                                    "headerName": "SPIROMETRY",
                                    "assName": "Spirometry (PMSPIRO)"
                                }
                            ]
                        }
                    ],
                    "$$hashKey": "object:141"
                },
                {
                    "id": 352,
                    "packageName": "Custom",
                    "companyId": 1,
                    "createdBy": null,
                    "creationDate": null,
                    "lastUpdatedBy": null,
                    "lastUpdateDate": null,
                    "itemId": null,
                    "itemCode": null,
                    "itemName": null,
                    "fee": null,
                    "AssessmentHeaders": [],
                    "$$hashKey": "object:142"
                },
                {
                    "id": 1242,
                    "packageName": "Edna May",
                    "companyId": 1,
                    "createdBy": 1,
                    "creationDate": "2015-03-24T07:30:29.000Z",
                    "lastUpdatedBy": 1,
                    "lastUpdateDate": "2015-03-24T07:31:14.000Z",
                    "itemId": null,
                    "itemCode": null,
                    "itemName": null,
                    "fee": 385,
                    "AssessmentHeaders": [
                        {
                            "id": "1000000001242",
                            "packId": 1242,
                            "assHeaderId": 1,
                            "headerName": "MEDICAL",
                            "Assessments": [
                                {
                                    "id": "1000000001242",
                                    "packId": 1242,
                                    "assHeaderId": 1,
                                    "assId": 1,
                                    "headerName": "MEDICAL",
                                    "assName": "Standard Medical Assessment ( including Height, Weight, BP, BMI, vision, urinalysis and GP review) (PMMA)"
                                }
                            ]
                        },
                        {
                            "id": "2000000001242",
                            "packId": 1242,
                            "assHeaderId": 2,
                            "headerName": "FUNCTION CAPACITY ASSESSMENT",
                            "Assessments": [
                                {
                                    "id": "2000000001242",
                                    "packId": 1242,
                                    "assHeaderId": 2,
                                    "assId": 2,
                                    "headerName": "FUNCTION CAPACITY ASSESSMENT",
                                    "assName": "Job-specific functional capacity/musculoskeletal assessment (PMMMSA)"
                                }
                            ]
                        },
                        {
                            "id": "3000000001242",
                            "packId": 1242,
                            "assHeaderId": 3,
                            "headerName": "DAS",
                            "Assessments": [
                                {
                                    "id": "3000000001242",
                                    "packId": 1242,
                                    "assHeaderId": 3,
                                    "assId": 3,
                                    "headerName": "DAS",
                                    "assName": "Lab drug and alcohol test (PMDAS)"
                                }
                            ]
                        },
                        {
                            "id": "4000000001242",
                            "packId": 1242,
                            "assHeaderId": 4,
                            "headerName": "OTHER MEDICAL TESTING",
                            "Assessments": [
                                {
                                    "id": "4000000001242",
                                    "packId": 1242,
                                    "assHeaderId": 4,
                                    "assId": 37,
                                    "headerName": "OTHER MEDICAL TESTING",
                                    "assName": "Chest x-ray"
                                }
                            ]
                        },
                        {
                            "id": "5000000001242",
                            "packId": 1242,
                            "assHeaderId": 5,
                            "headerName": "STANDARD AUDIO",
                            "Assessments": [
                                {
                                    "id": "5000000001242",
                                    "packId": 1242,
                                    "assHeaderId": 5,
                                    "assId": 10,
                                    "headerName": "STANDARD AUDIO",
                                    "assName": "WorkCover Audiometry (PMAUD)"
                                }
                            ]
                        },
                        {
                            "id": "6000000001242",
                            "packId": 1242,
                            "assHeaderId": 6,
                            "headerName": "SPIROMETRY",
                            "Assessments": [
                                {
                                    "id": "6000000001242",
                                    "packId": 1242,
                                    "assHeaderId": 6,
                                    "assId": 12,
                                    "headerName": "SPIROMETRY",
                                    "assName": "Spirometry (PMSPIRO)"
                                }
                            ]
                        }
                    ],
                    "$$hashKey": "object:143"
                },
                {
                    "id": 1435,
                    "packageName": "Instant DAS only==",
                    "companyId": 1,
                    "createdBy": 1,
                    "creationDate": "2015-06-22T12:39:40.000Z",
                    "lastUpdatedBy": 1,
                    "lastUpdateDate": "2015-06-22T12:40:06.000Z",
                    "itemId": null,
                    "itemCode": null,
                    "itemName": null,
                    "fee": null,
                    "AssessmentHeaders": [],
                    "$$hashKey": "object:144"
                },
                {
                    "id": 1436,
                    "packageName": "Instant DAS + Breatho",
                    "companyId": 1,
                    "createdBy": 1,
                    "creationDate": "2015-06-22T12:39:56.000Z",
                    "lastUpdatedBy": 1,
                    "lastUpdateDate": "2015-06-22T12:40:06.000Z",
                    "itemId": null,
                    "itemCode": null,
                    "itemName": null,
                    "fee": 65,
                    "AssessmentHeaders": [
                        {
                            "id": "3000000001436",
                            "packId": 1436,
                            "assHeaderId": 3,
                            "headerName": "DAS",
                            "Assessments": [
                                {
                                    "id": "3000000001436",
                                    "packId": 1436,
                                    "assHeaderId": 3,
                                    "assId": 13,
                                    "headerName": "DAS",
                                    "assName": "Instant drug test (PMIDA)"
                                },
                                {
                                    "id": "3000000001436",
                                    "packId": 1436,
                                    "assHeaderId": 3,
                                    "assId": 31,
                                    "headerName": "DAS",
                                    "assName": "Breathalyser (PMBAS)"
                                }
                            ]
                        }
                    ],
                    "$$hashKey": "object:145"
                }
            ],
            "bookings": [
                {
                    "bookingId": 22014,
                    "poNumber": "2",
                    "candidateId": 11130,
                    "companyId": 1,
                    "resultEmail": "phuong_thql@yahoo.com",
                    "invoiceEmail": "phuong_thql@yahoo.com",
                    "projectIdentofication": "N/A",
                    "comments": "",
                    "packageId": 36,
                    "packageName": "General Assessments.",
                    "assName": "   -  ECG (electrocardiography)<br>   -  Job-specific functional capacity/musculoskeletal assessment",
                    "fee": 150,
                    "siteId": 1,
                    "siteName": "Belmont",
                    "subCompanyId": null,
                    "subCompanyName": null,
                    "bookingPerson": "Robin Bell",
                    "contactNumber": "000",
                    "candidatesName": "test 2",
                    "dob": "2001-01-01T00:00:00.000Z",
                    "phone": "1",
                    "email": "1",
                    "position": null,
                    "appointmentTime": null,
                    "appointmentNotes": "test",
                    "appointmentStatus": "Confirmed",
                    "redimedNote": null
                },
                {
                    "bookingId": 22009,
                    "poNumber": "2",
                    "candidateId": 11129,
                    "companyId": 1,
                    "resultEmail": "phuong_thql@yahoo.com",
                    "invoiceEmail": "phuong_thql@yahoo.com",
                    "projectIdentofication": "N/A",
                    "comments": "",
                    "packageId": 949,
                    "packageName": "Admin Custom Package",
                    "assName": null,
                    "fee": 250,
                    "siteId": 1,
                    "siteName": "Belmont",
                    "subCompanyId": null,
                    "subCompanyName": null,
                    "bookingPerson": "Robin Bell",
                    "contactNumber": "000",
                    "candidatesName": "test ",
                    "dob": "2001-01-01T00:00:00.000Z",
                    "phone": "1",
                    "email": "phuong_thql@yahoo.com",
                    "position": null,
                    "appointmentTime": null,
                    "appointmentNotes": "test",
                    "appointmentStatus": "Confirmed",
                    "redimedNote": null
                },
                {
                    "bookingId": 17109,
                    "poNumber": "2",
                    "candidateId": 7401,
                    "companyId": 1,
                    "resultEmail": "phuong_thql@yahoo.com",
                    "invoiceEmail": "phuong_thql@yahoo.com",
                    "projectIdentofication": "N/A",
                    "comments": "",
                    "packageId": 658,
                    "packageName": "Admin Custom Package",
                    "assName": null,
                    "fee": 250,
                    "siteId": 1,
                    "siteName": "Belmont",
                    "subCompanyId": null,
                    "subCompanyName": null,
                    "bookingPerson": "Robin Bell",
                    "contactNumber": "000",
                    "candidatesName": "tets",
                    "dob": "2001-01-01T00:00:00.000Z",
                    "phone": "1",
                    "email": "phuong_thql@yahoo.com",
                    "position": null,
                    "appointmentTime": "2014-09-16T15:00:00.000Z",
                    "appointmentNotes": "",
                    "appointmentStatus": "Confirmed",
                    "redimedNote": null
                },
                {
                    "bookingId": 11852,
                    "poNumber": "2",
                    "candidateId": 4227,
                    "companyId": 1,
                    "resultEmail": "phuong_thql@yahoo.com",
                    "invoiceEmail": "phuong_thql@yahoo.com",
                    "projectIdentofication": "N/A",
                    "comments": "",
                    "packageId": 36,
                    "packageName": "General Assessments.",
                    "assName": "   -  ECG (electrocardiography)<br>   -  Job-specific functional capacity/musculoskeletal assessment",
                    "fee": 150,
                    "siteId": 1,
                    "siteName": "Belmont",
                    "subCompanyId": null,
                    "subCompanyName": null,
                    "bookingPerson": "Robin Bell",
                    "contactNumber": "000",
                    "candidatesName": "1",
                    "dob": "2001-01-01T00:00:00.000Z",
                    "phone": "1",
                    "email": "1",
                    "position": null,
                    "appointmentTime": null,
                    "appointmentNotes": "test",
                    "appointmentStatus": "Confirmed",
                    "redimedNote": null
                },
                {
                    "bookingId": 9898,
                    "poNumber": "2",
                    "candidateId": 3522,
                    "companyId": 1,
                    "resultEmail": "phuong_thql@yahoo.com",
                    "invoiceEmail": "phuong_thql@yahoo.com",
                    "projectIdentofication": "N/A",
                    "comments": "",
                    "packageId": 36,
                    "packageName": "General Assessments.",
                    "assName": "   -  ECG (electrocardiography)<br>   -  Job-specific functional capacity/musculoskeletal assessment",
                    "fee": 150,
                    "siteId": 2,
                    "siteName": "Joondalup",
                    "subCompanyId": null,
                    "subCompanyName": null,
                    "bookingPerson": "Robin Bell",
                    "contactNumber": "000",
                    "candidatesName": "trial2",
                    "dob": "1988-05-02T00:00:00.000Z",
                    "phone": "898",
                    "email": "hjhj",
                    "position": "Worker",
                    "appointmentTime": null,
                    "appointmentNotes": "test 2",
                    "appointmentStatus": "Confirmed",
                    "redimedNote": null
                },
                {
                    "bookingId": 6901,
                    "poNumber": "22",
                    "candidateId": 2446,
                    "companyId": 1,
                    "resultEmail": "phuong_thql@yahoo.com",
                    "invoiceEmail": "phuong_thql@yahoo.com",
                    "projectIdentofication": "fhfhf",
                    "comments": "",
                    "packageId": 36,
                    "packageName": "General Assessments.",
                    "assName": "   -  ECG (electrocardiography)<br>   -  Job-specific functional capacity/musculoskeletal assessment",
                    "fee": 150,
                    "siteId": 1,
                    "siteName": "Belmont",
                    "subCompanyId": 15,
                    "subCompanyName": "Site 2",
                    "bookingPerson": "Robin Bell",
                    "contactNumber": "000",
                    "candidatesName": "dgd",
                    "dob": "2014-04-08T00:00:00.000Z",
                    "phone": "5446",
                    "email": "fhhfhf",
                    "position": "Worker",
                    "appointmentTime": "2014-04-08T10:30:00.000Z",
                    "appointmentNotes": "",
                    "appointmentStatus": "Confirmed",
                    "redimedNote": null
                },
                {
                    "bookingId": 1523,
                    "poNumber": "2",
                    "candidateId": 554,
                    "companyId": 1,
                    "resultEmail": "phuong_thql@yahoo.com",
                    "invoiceEmail": "phuong_thql@yahoo.com",
                    "projectIdentofication": "o",
                    "comments": "",
                    "packageId": 36,
                    "packageName": "General Assessments.",
                    "assName": "   -  ECG (electrocardiography)<br>   -  Job-specific functional capacity/musculoskeletal assessment",
                    "fee": 150,
                    "siteId": 1,
                    "siteName": "Belmont",
                    "subCompanyId": null,
                    "subCompanyName": null,
                    "bookingPerson": "Robin Bell",
                    "contactNumber": "000",
                    "candidatesName": "tttttttttt",
                    "dob": "2009-09-09T00:00:00.000Z",
                    "phone": "1",
                    "email": "phuong_thql@yahoo.com",
                    "position": null,
                    "appointmentTime": "2014-06-03T07:30:00.000Z",
                    "appointmentNotes": "",
                    "appointmentStatus": "Confirmed",
                    "redimedNote": null
                },
                {
                    "bookingId": 26460,
                    "poNumber": "2",
                    "candidateId": 1,
                    "companyId": 1,
                    "resultEmail": "phuong_thql@yahoo.com",
                    "invoiceEmail": "phuong_thql@yahoo.com",
                    "projectIdentofication": "N/A",
                    "comments": "",
                    "packageId": 1111,
                    "packageName": "Admin Custom Package",
                    "assName": null,
                    "fee": 495,
                    "siteId": 1,
                    "siteName": "Belmont",
                    "subCompanyId": null,
                    "subCompanyName": null,
                    "bookingPerson": "Robin Bell",
                    "contactNumber": "000",
                    "candidatesName": "test",
                    "dob": "2001-01-01T00:00:00.000Z",
                    "phone": "1",
                    "email": "1",
                    "position": null,
                    "appointmentTime": "2015-01-26T07:30:00.000Z",
                    "appointmentNotes": "",
                    "appointmentStatus": "Confirmed",
                    "redimedNote": null
                }
            ],
            "positions": [
                {
                    "id": 27,
                    "positionName": "Worker",
                    "companyId": 1,
                    "createdBy": 1,
                    "creationDate": "2013-12-10T11:02:05.000Z",
                    "lastUpdatedBy": 1,
                    "lastUpdateDate": "2013-12-10T11:02:32.000Z"
                },
                {
                    "id": 28,
                    "positionName": "Chef",
                    "companyId": 1,
                    "createdBy": 1,
                    "creationDate": "2013-12-10T11:02:14.000Z",
                    "lastUpdatedBy": 1,
                    "lastUpdateDate": "2013-12-10T11:02:32.000Z"
                },
                {
                    "id": 29,
                    "positionName": "Accountant",
                    "companyId": 1,
                    "createdBy": 1,
                    "creationDate": "2013-12-10T11:02:23.000Z",
                    "lastUpdatedBy": 1,
                    "lastUpdateDate": "2013-12-10T11:02:32.000Z"
                },
                {
                    "id": 79,
                    "positionName": "Admin",
                    "companyId": 1,
                    "createdBy": 1,
                    "creationDate": "2014-04-14T09:53:04.000Z",
                    "lastUpdatedBy": 1,
                    "lastUpdateDate": "2014-04-14T09:53:17.000Z"
                },
                {
                    "id": 366,
                    "positionName": "Supervisor",
                    "companyId": 1,
                    "createdBy": 1,
                    "creationDate": "2015-03-23T09:40:40.000Z",
                    "lastUpdatedBy": 1,
                    "lastUpdateDate": "2015-03-23T09:40:46.000Z"
                },
                {
                    "id": 367,
                    "positionName": "Trade Assistant",
                    "companyId": 1,
                    "createdBy": 1,
                    "creationDate": "2015-03-24T07:28:38.000Z",
                    "lastUpdatedBy": 1,
                    "lastUpdateDate": "2015-03-24T07:28:45.000Z"
                },
                {
                    "id": 505,
                    "positionName": "Boilermaker",
                    "companyId": 1,
                    "createdBy": 1,
                    "creationDate": "2015-06-22T12:41:12.000Z",
                    "lastUpdatedBy": 1,
                    "lastUpdateDate": "2015-06-22T12:41:31.000Z"
                }
            ],
            "assessments": [
                {
                    "id": 1,
                    "assName": "MEDICAL",
                    "createdBy": null,
                    "creationDate": null,
                    "lastUpdatedBy": null,
                    "lastUpdateDate": null,
                    "companyId": null,
                    "assessments": [
                        {
                            "headerId": 1,
                            "id": 1,
                            "assName": "Standard Medical Assessment ( including Height, Weight, BP, BMI, vision, urinalysis and GP review) (PMMA)",
                            "period": null,
                            "createdBy": null,
                            "creationDate": null,
                            "lastUpdatedBy": 3,
                            "lastUpdateDate": "2015-02-09T15:22:08.000Z",
                            "isenable": null,
                            "itemId": null,
                            "itemCode": "PMMA",
                            "itemName": null,
                            "price": 100
                        },
                        {
                            "headerId": 1,
                            "id": 39,
                            "assName": "Full gorgon medical",
                            "period": null,
                            "createdBy": 3,
                            "creationDate": "2015-06-12T12:35:54.000Z",
                            "lastUpdatedBy": 3,
                            "lastUpdateDate": "2015-06-12T12:35:59.000Z",
                            "isenable": 1,
                            "itemId": null,
                            "itemCode": null,
                            "itemName": null,
                            "price": null
                        },
                        {
                            "headerId": 1,
                            "id": 41,
                            "assName": "CPPC medical",
                            "period": null,
                            "createdBy": 3,
                            "creationDate": "2015-10-02T13:01:59.000Z",
                            "lastUpdatedBy": 3,
                            "lastUpdateDate": "2015-10-02T13:02:02.000Z",
                            "isenable": 1,
                            "itemId": null,
                            "itemCode": null,
                            "itemName": null,
                            "price": null
                        },
                        {
                            "headerId": 1,
                            "id": 42,
                            "assName": "Full PEM lead blood levels",
                            "period": null,
                            "createdBy": 3,
                            "creationDate": "2015-11-06T12:28:02.000Z",
                            "lastUpdatedBy": 3,
                            "lastUpdateDate": "2015-11-06T12:29:09.000Z",
                            "isenable": 1,
                            "itemId": null,
                            "itemCode": null,
                            "itemName": null,
                            "price": null
                        }
                    ]
                },
                {
                    "id": 2,
                    "assName": "FUNCTION CAPACITY ASSESSMENT",
                    "createdBy": null,
                    "creationDate": null,
                    "lastUpdatedBy": null,
                    "lastUpdateDate": null,
                    "companyId": null,
                    "assessments": [
                        {
                            "headerId": 2,
                            "id": 2,
                            "assName": "Job-specific functional capacity/musculoskeletal assessment (PMMMSA)",
                            "period": 1,
                            "createdBy": null,
                            "creationDate": null,
                            "lastUpdatedBy": 3,
                            "lastUpdateDate": "2015-02-09T15:22:34.000Z",
                            "isenable": null,
                            "itemId": null,
                            "itemCode": "PMMSA",
                            "itemName": null,
                            "price": 150
                        },
                        {
                            "headerId": 2,
                            "id": 9,
                            "assName": "Area specific/musculoskeletal physical assessment (PMASFCA)",
                            "period": 1,
                            "createdBy": null,
                            "creationDate": null,
                            "lastUpdatedBy": 3,
                            "lastUpdateDate": "2015-02-09T15:22:54.000Z",
                            "isenable": null,
                            "itemId": null,
                            "itemCode": "PMASFCA",
                            "itemName": null,
                            "price": 90
                        },
                        {
                            "headerId": 2,
                            "id": 30,
                            "assName": "Back & flexibility assessment (PMBFT)",
                            "period": 1,
                            "createdBy": 3,
                            "creationDate": "2014-03-31T12:52:14.000Z",
                            "lastUpdatedBy": 3,
                            "lastUpdateDate": "2015-02-09T15:22:54.000Z",
                            "isenable": null,
                            "itemId": null,
                            "itemCode": "PMBFT",
                            "itemName": null,
                            "price": 50
                        },
                        {
                            "headerId": 2,
                            "id": 44,
                            "assName": "Chester step test ",
                            "period": null,
                            "createdBy": 3,
                            "creationDate": "2015-11-10T08:50:55.000Z",
                            "lastUpdatedBy": 3,
                            "lastUpdateDate": "2015-11-10T08:51:21.000Z",
                            "isenable": 1,
                            "itemId": null,
                            "itemCode": null,
                            "itemName": null,
                            "price": null
                        }
                    ]
                },
                {
                    "id": 3,
                    "assName": "DAS",
                    "createdBy": null,
                    "creationDate": null,
                    "lastUpdatedBy": 3,
                    "lastUpdateDate": "2014-03-12T10:26:58.000Z",
                    "companyId": null,
                    "assessments": [
                        {
                            "headerId": 3,
                            "id": 3,
                            "assName": "Lab drug and alcohol test (PMDAS)",
                            "period": -1,
                            "createdBy": null,
                            "creationDate": null,
                            "lastUpdatedBy": 3,
                            "lastUpdateDate": "2015-02-09T15:23:39.000Z",
                            "isenable": null,
                            "itemId": null,
                            "itemCode": "PMDAS",
                            "itemName": null,
                            "price": 45
                        },
                        {
                            "headerId": 3,
                            "id": 13,
                            "assName": "Instant drug test (PMIDA)",
                            "period": -1,
                            "createdBy": null,
                            "creationDate": null,
                            "lastUpdatedBy": 3,
                            "lastUpdateDate": "2015-02-09T15:23:39.000Z",
                            "isenable": null,
                            "itemId": null,
                            "itemCode": "PMIDA",
                            "itemName": null,
                            "price": 50
                        },
                        {
                            "headerId": 3,
                            "id": 14,
                            "assName": "Alcohol breath test (PMBAS)",
                            "period": -1,
                            "createdBy": null,
                            "creationDate": null,
                            "lastUpdatedBy": 3,
                            "lastUpdateDate": "2015-02-09T15:23:39.000Z",
                            "isenable": null,
                            "itemId": null,
                            "itemCode": "PMBAS",
                            "itemName": null,
                            "price": 15
                        },
                        {
                            "headerId": 3,
                            "id": 15,
                            "assName": "Synthetic Cannabis Testing (PMSYNCAN)",
                            "period": -1,
                            "createdBy": 3,
                            "creationDate": "2013-12-03T22:55:35.000Z",
                            "lastUpdatedBy": 3,
                            "lastUpdateDate": "2015-02-09T15:23:39.000Z",
                            "isenable": null,
                            "itemId": null,
                            "itemCode": "PMSYNCAN",
                            "itemName": null,
                            "price": 115.5
                        },
                        {
                            "headerId": 3,
                            "id": 31,
                            "assName": "Breathalyser (PMBAS)",
                            "period": -1,
                            "createdBy": 3,
                            "creationDate": "2014-04-24T16:26:17.000Z",
                            "lastUpdatedBy": 3,
                            "lastUpdateDate": "2015-02-09T15:23:39.000Z",
                            "isenable": null,
                            "itemId": null,
                            "itemCode": "PMBAS",
                            "itemName": null,
                            "price": 15
                        }
                    ]
                },
                {
                    "id": 4,
                    "assName": "OTHER MEDICAL TESTING",
                    "createdBy": null,
                    "creationDate": null,
                    "lastUpdatedBy": 3,
                    "lastUpdateDate": "2013-12-03T23:07:06.000Z",
                    "companyId": null,
                    "assessments": [
                        {
                            "headerId": 4,
                            "id": 4,
                            "assName": "Commercial Vehicle Drivers Medical Assessment (PMCDFM)",
                            "period": null,
                            "createdBy": null,
                            "creationDate": null,
                            "lastUpdatedBy": 3,
                            "lastUpdateDate": "2015-02-09T15:25:51.000Z",
                            "isenable": null,
                            "itemId": null,
                            "itemCode": "PMCDFM",
                            "itemName": null,
                            "price": 60
                        },
                        {
                            "headerId": 4,
                            "id": 16,
                            "assName": "Rail Cat 1 Medical (ECG and Referral needed) (PMRAIL1)",
                            "period": null,
                            "createdBy": 3,
                            "creationDate": "2013-12-03T23:07:30.000Z",
                            "lastUpdatedBy": 3,
                            "lastUpdateDate": "2015-02-09T15:25:51.000Z",
                            "isenable": null,
                            "itemId": null,
                            "itemCode": "PMRAIL1",
                            "itemName": null,
                            "price": 300
                        },
                        {
                            "headerId": 4,
                            "id": 17,
                            "assName": "Rail Cat 2 Medical (PMRAIL2)",
                            "period": null,
                            "createdBy": 3,
                            "creationDate": "2013-12-03T23:07:43.000Z",
                            "lastUpdatedBy": 3,
                            "lastUpdateDate": "2015-02-09T15:25:51.000Z",
                            "isenable": null,
                            "itemId": null,
                            "itemCode": "PMRAIL2",
                            "itemName": null,
                            "price": 200
                        },
                        {
                            "headerId": 4,
                            "id": 18,
                            "assName": "Rail Cat 3 Medical (PMRAIL3)",
                            "period": null,
                            "createdBy": 3,
                            "creationDate": "2013-12-03T23:07:53.000Z",
                            "lastUpdatedBy": 3,
                            "lastUpdateDate": "2015-02-09T15:25:51.000Z",
                            "isenable": null,
                            "itemId": null,
                            "itemCode": "PMRAIL3",
                            "itemName": null,
                            "price": 120
                        },
                        {
                            "headerId": 4,
                            "id": 19,
                            "assName": "Newmont Medical",
                            "period": null,
                            "createdBy": 3,
                            "creationDate": "2013-12-03T23:08:12.000Z",
                            "lastUpdatedBy": 3,
                            "lastUpdateDate": "2013-12-03T23:09:04.000Z",
                            "isenable": null,
                            "itemId": null,
                            "itemCode": null,
                            "itemName": null,
                            "price": null
                        },
                        {
                            "headerId": 4,
                            "id": 20,
                            "assName": "Flagship Medical (PMFLAG)",
                            "period": null,
                            "createdBy": 3,
                            "creationDate": "2013-12-03T23:08:25.000Z",
                            "lastUpdatedBy": 3,
                            "lastUpdateDate": "2015-02-09T15:25:51.000Z",
                            "isenable": null,
                            "itemId": null,
                            "itemCode": "PMFLAG",
                            "itemName": null,
                            "price": 250
                        },
                        {
                            "headerId": 4,
                            "id": 21,
                            "assName": "Huet Medical (PMHUET)",
                            "period": null,
                            "createdBy": 3,
                            "creationDate": "2013-12-03T23:08:30.000Z",
                            "lastUpdatedBy": 3,
                            "lastUpdateDate": "2015-02-09T15:25:51.000Z",
                            "isenable": null,
                            "itemId": null,
                            "itemCode": "PMHUET",
                            "itemName": null,
                            "price": 60
                        },
                        {
                            "headerId": 4,
                            "id": 22,
                            "assName": "Shotfirers Medical (PMSHOT)",
                            "period": null,
                            "createdBy": 3,
                            "creationDate": "2013-12-03T23:08:44.000Z",
                            "lastUpdatedBy": 3,
                            "lastUpdateDate": "2015-02-09T15:25:51.000Z",
                            "isenable": null,
                            "itemId": null,
                            "itemCode": "PMSHOT",
                            "itemName": null,
                            "price": 20
                        },
                        {
                            "headerId": 4,
                            "id": 25,
                            "assName": "Respirator questionnaire (PMRUQ)",
                            "period": null,
                            "createdBy": 3,
                            "creationDate": "2014-01-14T12:26:43.000Z",
                            "lastUpdatedBy": 3,
                            "lastUpdateDate": "2015-02-09T15:25:51.000Z",
                            "isenable": null,
                            "itemId": null,
                            "itemCode": "PMRUQ",
                            "itemName": null,
                            "price": 20
                        },
                        {
                            "headerId": 4,
                            "id": 26,
                            "assName": "Weld Fumes Urine Metal Test (PMWFMU)",
                            "period": null,
                            "createdBy": 3,
                            "creationDate": "2014-01-14T12:26:48.000Z",
                            "lastUpdatedBy": 3,
                            "lastUpdateDate": "2015-02-09T15:25:51.000Z",
                            "isenable": null,
                            "itemId": null,
                            "itemCode": "PMWFMU",
                            "itemName": null,
                            "price": 80
                        },
                        {
                            "headerId": 4,
                            "id": 28,
                            "assName": "Heat stress questionnaire (PMHT)",
                            "period": null,
                            "createdBy": 3,
                            "creationDate": "2014-03-04T08:23:55.000Z",
                            "lastUpdatedBy": 3,
                            "lastUpdateDate": "2015-02-09T15:25:51.000Z",
                            "isenable": null,
                            "itemId": null,
                            "itemCode": "PMHT",
                            "itemName": null,
                            "price": 20
                        },
                        {
                            "headerId": 4,
                            "id": 29,
                            "assName": "Fatigue questionnaire (PMFQ)",
                            "period": null,
                            "createdBy": 3,
                            "creationDate": "2014-03-04T08:24:00.000Z",
                            "lastUpdatedBy": 3,
                            "lastUpdateDate": "2015-02-09T15:25:51.000Z",
                            "isenable": null,
                            "itemId": null,
                            "itemCode": "PMFQ",
                            "itemName": null,
                            "price": 20
                        },
                        {
                            "headerId": 4,
                            "id": 32,
                            "assName": "Stat Dec",
                            "period": null,
                            "createdBy": 3,
                            "creationDate": "2014-05-15T17:10:26.000Z",
                            "lastUpdatedBy": 3,
                            "lastUpdateDate": "2014-05-15T17:10:40.000Z",
                            "isenable": null,
                            "itemId": null,
                            "itemCode": null,
                            "itemName": null,
                            "price": null
                        },
                        {
                            "headerId": 4,
                            "id": 33,
                            "assName": "Back Flexibility (PMBFT)",
                            "period": null,
                            "createdBy": 3,
                            "creationDate": "2014-06-11T15:52:40.000Z",
                            "lastUpdatedBy": 3,
                            "lastUpdateDate": "2015-02-09T15:25:51.000Z",
                            "isenable": 1,
                            "itemId": null,
                            "itemCode": "PMBFT",
                            "itemName": null,
                            "price": 50
                        },
                        {
                            "headerId": 4,
                            "id": 34,
                            "assName": "Vision test (PMVIS)",
                            "period": null,
                            "createdBy": 3,
                            "creationDate": "2014-06-11T15:52:46.000Z",
                            "lastUpdatedBy": 3,
                            "lastUpdateDate": "2015-02-09T15:25:51.000Z",
                            "isenable": 1,
                            "itemId": null,
                            "itemCode": "PMVIS",
                            "itemName": null,
                            "price": 30
                        },
                        {
                            "headerId": 4,
                            "id": 35,
                            "assName": "mental health Q (PMMHQ)",
                            "period": null,
                            "createdBy": 3,
                            "creationDate": "2014-07-28T09:54:53.000Z",
                            "lastUpdatedBy": 3,
                            "lastUpdateDate": "2015-02-09T15:25:51.000Z",
                            "isenable": 1,
                            "itemId": null,
                            "itemCode": "PMMHQ",
                            "itemName": null,
                            "price": 20
                        },
                        {
                            "headerId": 4,
                            "id": 36,
                            "assName": "test",
                            "period": null,
                            "createdBy": 3,
                            "creationDate": "2014-10-25T11:51:57.000Z",
                            "lastUpdatedBy": 3,
                            "lastUpdateDate": "2015-02-09T15:25:51.000Z",
                            "isenable": 1,
                            "itemId": null,
                            "itemCode": null,
                            "itemName": null,
                            "price": 181.82
                        },
                        {
                            "headerId": 4,
                            "id": 37,
                            "assName": "Chest x-ray",
                            "period": null,
                            "createdBy": 3,
                            "creationDate": "2015-03-23T14:10:29.000Z",
                            "lastUpdatedBy": 3,
                            "lastUpdateDate": "2015-03-23T14:10:43.000Z",
                            "isenable": 1,
                            "itemId": null,
                            "itemCode": null,
                            "itemName": null,
                            "price": null
                        },
                        {
                            "headerId": 4,
                            "id": 38,
                            "assName": "Hep A and Hep B blood Test",
                            "period": null,
                            "createdBy": 3,
                            "creationDate": "2015-03-25T10:18:50.000Z",
                            "lastUpdatedBy": 3,
                            "lastUpdateDate": "2015-03-25T10:18:56.000Z",
                            "isenable": 1,
                            "itemId": null,
                            "itemCode": null,
                            "itemName": null,
                            "price": null
                        },
                        {
                            "headerId": 4,
                            "id": 40,
                            "assName": "Hep A&B",
                            "period": null,
                            "createdBy": 3,
                            "creationDate": "2015-06-12T12:36:30.000Z",
                            "lastUpdatedBy": 3,
                            "lastUpdateDate": "2015-06-12T12:36:45.000Z",
                            "isenable": 1,
                            "itemId": null,
                            "itemCode": null,
                            "itemName": null,
                            "price": null
                        },
                        {
                            "headerId": 4,
                            "id": 58,
                            "assName": "CPPC Medical Paperwork required",
                            "period": null,
                            "createdBy": 3,
                            "creationDate": "2015-12-03T11:12:12.000Z",
                            "lastUpdatedBy": 3,
                            "lastUpdateDate": "2015-12-03T11:12:27.000Z",
                            "isenable": 1,
                            "itemId": null,
                            "itemCode": null,
                            "itemName": null,
                            "price": null
                        }
                    ]
                },
                {
                    "id": 5,
                    "assName": "STANDARD AUDIO",
                    "createdBy": null,
                    "creationDate": null,
                    "lastUpdatedBy": null,
                    "lastUpdateDate": null,
                    "companyId": null,
                    "assessments": [
                        {
                            "headerId": 5,
                            "id": 10,
                            "assName": "WorkCover Audiometry (PMAUD)",
                            "period": null,
                            "createdBy": null,
                            "creationDate": null,
                            "lastUpdatedBy": 3,
                            "lastUpdateDate": "2015-02-09T15:27:22.000Z",
                            "isenable": null,
                            "itemId": null,
                            "itemCode": "PMAUD",
                            "itemName": null,
                            "price": 50
                        },
                        {
                            "headerId": 5,
                            "id": 11,
                            "assName": "Standard Audiometry (PMAUD)",
                            "period": null,
                            "createdBy": null,
                            "creationDate": null,
                            "lastUpdatedBy": 3,
                            "lastUpdateDate": "2015-02-09T15:27:22.000Z",
                            "isenable": null,
                            "itemId": null,
                            "itemCode": "PMAUD",
                            "itemName": null,
                            "price": 50
                        }
                    ]
                },
                {
                    "id": 6,
                    "assName": "SPIROMETRY",
                    "createdBy": null,
                    "creationDate": null,
                    "lastUpdatedBy": null,
                    "lastUpdateDate": null,
                    "companyId": null,
                    "assessments": [
                        {
                            "headerId": 6,
                            "id": 12,
                            "assName": "Spirometry (PMSPIRO)",
                            "period": null,
                            "createdBy": null,
                            "creationDate": null,
                            "lastUpdatedBy": 3,
                            "lastUpdateDate": "2015-02-09T15:27:40.000Z",
                            "isenable": null,
                            "itemId": null,
                            "itemCode": "PMSPIRO",
                            "itemName": null,
                            "price": 40
                        }
                    ]
                },
                {
                    "id": 7,
                    "assName": "CARDIOVASCULAR TESTING",
                    "createdBy": 3,
                    "creationDate": "2013-12-03T23:09:10.000Z",
                    "lastUpdatedBy": 3,
                    "lastUpdateDate": "2013-12-03T23:09:19.000Z",
                    "companyId": null,
                    "assessments": [
                        {
                            "headerId": 7,
                            "id": 24,
                            "assName": "ECG (electrocardiography) (PMECG)",
                            "period": null,
                            "createdBy": 3,
                            "creationDate": "2013-12-04T08:27:21.000Z",
                            "lastUpdatedBy": 3,
                            "lastUpdateDate": "2015-02-09T15:28:23.000Z",
                            "isenable": null,
                            "itemId": null,
                            "itemCode": "PMECG",
                            "itemName": null,
                            "price": 99
                        }
                    ]
                },
                {
                    "id": 8,
                    "assName": "WELD FUME MU TEST",
                    "createdBy": 3,
                    "creationDate": "2014-01-14T14:24:41.000Z",
                    "lastUpdatedBy": 3,
                    "lastUpdateDate": "2014-01-14T14:25:02.000Z",
                    "companyId": null,
                    "assessments": [
                        {
                            "headerId": 8,
                            "id": 27,
                            "assName": "Weld Fumes Urine Metal Test (PMWMFU)",
                            "period": null,
                            "createdBy": 3,
                            "creationDate": "2014-01-14T14:26:26.000Z",
                            "lastUpdatedBy": 3,
                            "lastUpdateDate": "2015-02-09T15:28:47.000Z",
                            "isenable": null,
                            "itemId": null,
                            "itemCode": "PMWMFU",
                            "itemName": null,
                            "price": 80
                        }
                    ]
                },
                {
                    "id": 10,
                    "assName": "MIND SCREEN ASSESSMENT",
                    "createdBy": 3,
                    "creationDate": "2015-10-02T12:39:29.000Z",
                    "lastUpdatedBy": 3,
                    "lastUpdateDate": "2015-10-02T12:40:04.000Z",
                    "companyId": null,
                    "assessments": []
                },
                {
                    "id": 11,
                    "assName": "LEAD BLOOD LEVELS",
                    "createdBy": 3,
                    "creationDate": "2015-11-06T12:38:36.000Z",
                    "lastUpdatedBy": 3,
                    "lastUpdateDate": "2015-11-06T12:39:05.000Z",
                    "companyId": null,
                    "assessments": [
                        {
                            "headerId": 11,
                            "id": 43,
                            "assName": "lead blood test",
                            "period": null,
                            "createdBy": 3,
                            "creationDate": "2015-11-06T13:12:16.000Z",
                            "lastUpdatedBy": 3,
                            "lastUpdateDate": "2015-11-06T13:12:29.000Z",
                            "isenable": 1,
                            "itemId": null,
                            "itemCode": null,
                            "itemName": null,
                            "price": null
                        }
                    ]
                },
                {
                    "id": 12,
                    "assName": "BP MEDICAL (PMBP)",
                    "createdBy": 3,
                    "creationDate": "2015-11-23T09:54:27.000Z",
                    "lastUpdatedBy": 3,
                    "lastUpdateDate": "2015-11-23T10:02:14.000Z",
                    "companyId": null,
                    "assessments": [
                        {
                            "headerId": 12,
                            "id": 50,
                            "assName": "Standard Medical Assessment",
                            "period": null,
                            "createdBy": 3,
                            "creationDate": "2015-11-23T09:59:41.000Z",
                            "lastUpdatedBy": 3,
                            "lastUpdateDate": "2015-11-23T09:59:52.000Z",
                            "isenable": 1,
                            "itemId": null,
                            "itemCode": null,
                            "itemName": null,
                            "price": null
                        },
                        {
                            "headerId": 12,
                            "id": 51,
                            "assName": "Lab Drug & Alcohol",
                            "period": null,
                            "createdBy": 3,
                            "creationDate": "2015-11-23T10:00:05.000Z",
                            "lastUpdatedBy": 3,
                            "lastUpdateDate": "2015-11-23T10:00:53.000Z",
                            "isenable": 1,
                            "itemId": null,
                            "itemCode": null,
                            "itemName": null,
                            "price": null
                        },
                        {
                            "headerId": 12,
                            "id": 52,
                            "assName": "Workcover Audio",
                            "period": null,
                            "createdBy": 3,
                            "creationDate": "2015-11-23T10:00:30.000Z",
                            "lastUpdatedBy": 3,
                            "lastUpdateDate": "2015-11-23T10:00:53.000Z",
                            "isenable": 1,
                            "itemId": null,
                            "itemCode": null,
                            "itemName": null,
                            "price": null
                        },
                        {
                            "headerId": 12,
                            "id": 53,
                            "assName": "Spirometry",
                            "period": null,
                            "createdBy": 3,
                            "creationDate": "2015-11-23T10:00:38.000Z",
                            "lastUpdatedBy": 3,
                            "lastUpdateDate": "2015-11-23T10:00:53.000Z",
                            "isenable": 1,
                            "itemId": null,
                            "itemCode": null,
                            "itemName": null,
                            "price": null
                        },
                        {
                            "headerId": 12,
                            "id": 54,
                            "assName": "ECG",
                            "period": null,
                            "createdBy": 3,
                            "creationDate": "2015-11-23T10:00:44.000Z",
                            "lastUpdatedBy": 3,
                            "lastUpdateDate": "2015-11-23T10:00:53.000Z",
                            "isenable": 1,
                            "itemId": null,
                            "itemCode": null,
                            "itemName": null,
                            "price": null
                        }
                    ]
                },
                {
                    "id": 13,
                    "assName": "FOCUSED MEDICAL ",
                    "createdBy": 3,
                    "creationDate": "2015-11-24T09:30:22.000Z",
                    "lastUpdatedBy": 3,
                    "lastUpdateDate": "2015-11-24T09:30:54.000Z",
                    "companyId": null,
                    "assessments": [
                        {
                            "headerId": 13,
                            "id": 55,
                            "assName": "Standard Medical (PMMA)",
                            "period": null,
                            "createdBy": 3,
                            "creationDate": "2015-11-24T09:39:21.000Z",
                            "lastUpdatedBy": 3,
                            "lastUpdateDate": "2015-11-24T09:39:36.000Z",
                            "isenable": 1,
                            "itemId": null,
                            "itemCode": null,
                            "itemName": null,
                            "price": null
                        }
                    ]
                },
                {
                    "id": 14,
                    "assName": "SPECIALISED PAPERWORK",
                    "createdBy": 3,
                    "creationDate": "2015-12-03T10:20:56.000Z",
                    "lastUpdatedBy": 3,
                    "lastUpdateDate": "2015-12-03T10:22:12.000Z",
                    "companyId": null,
                    "assessments": [
                        {
                            "headerId": 14,
                            "id": 57,
                            "assName": "This assessment needs to be conducted on CPPC Paperwork",
                            "period": null,
                            "createdBy": 3,
                            "creationDate": "2015-12-03T10:25:11.000Z",
                            "lastUpdatedBy": 3,
                            "lastUpdateDate": "2015-12-04T12:19:31.000Z",
                            "isenable": 1,
                            "itemId": null,
                            "itemCode": null,
                            "itemName": null,
                            "price": null
                        }
                    ]
                },
                {
                    "id": 15,
                    "assName": "COMMERCIAL DRIVERS (PMCDTRUCK)",
                    "createdBy": 3,
                    "creationDate": "2015-12-03T11:48:28.000Z",
                    "lastUpdatedBy": 3,
                    "lastUpdateDate": "2015-12-03T11:48:51.000Z",
                    "companyId": null,
                    "assessments": [
                        {
                            "headerId": 15,
                            "id": 62,
                            "assName": "Job specific functional",
                            "period": null,
                            "createdBy": 3,
                            "creationDate": "2015-12-03T11:54:54.000Z",
                            "lastUpdatedBy": 3,
                            "lastUpdateDate": "2015-12-03T11:55:42.000Z",
                            "isenable": 1,
                            "itemId": null,
                            "itemCode": null,
                            "itemName": null,
                            "price": null
                        },
                        {
                            "headerId": 15,
                            "id": 63,
                            "assName": "Audio",
                            "period": null,
                            "createdBy": 3,
                            "creationDate": "2015-12-03T11:55:11.000Z",
                            "lastUpdatedBy": 3,
                            "lastUpdateDate": "2015-12-03T11:55:42.000Z",
                            "isenable": 1,
                            "itemId": null,
                            "itemCode": null,
                            "itemName": null,
                            "price": null
                        },
                        {
                            "headerId": 15,
                            "id": 64,
                            "assName": "Commercial drivers assessment ",
                            "period": null,
                            "createdBy": 3,
                            "creationDate": "2015-12-03T11:55:17.000Z",
                            "lastUpdatedBy": 3,
                            "lastUpdateDate": "2015-12-03T11:55:42.000Z",
                            "isenable": 1,
                            "itemId": null,
                            "itemCode": null,
                            "itemName": null,
                            "price": null
                        }
                    ]
                }
            ]
        },
        init: function (callback) {
            callback(this.companyObject);
        },
        refreshBookingList : function(callback){
                callback(companyData);
        },
        refreshPositionList : function(callback){
                callback(companyData);
        },
        getCompanyId: function(){
            //console.log("getCompanyId=",companyData);
            return companyData == null ? null :companyData.id;
        },
        getCompany: function (callback) {
            callback(companyData);
        }
    }

var mockupPositions = {}

var mockModalInstance = {                    // Create a mock object using spies
    close: jasmine.createSpy('modalInstance.close'),
    dismiss: jasmine.createSpy('modalInstance.dismiss'),
    result: {
        then: jasmine.createSpy('modalInstance.result.then')
    }
};

var mockUibModal = {
    result: {
        then: function (confirmCallback, cancelCallback) {
            this.confirmCallBack = confirmCallback;
            this.cancelCallback = cancelCallback;
            return this;
        },
        catch: function (cancelCallback) {
            this.cancelCallback = cancelCallback;
            return this;
        },
        finally: function (finallyCallback) {
            this.finallyCallback = finallyCallback;
            return this;
        }
    },
    close: function (item) {
        this.result.confirmCallBack(item);
    },
    dismiss: function (item) {
        this.result.cancelCallback(item);
    },
    finally: function () {
        this.result.finallyCallback();
    },
    open: function(defination){ return this;}
};

describe('Controller: PositionsMainCtrl', function () {

    var CompanyFactory,uibModal,modalInstance,Positions;

    beforeEach(function() {
        module(function($provide) {
            $provide.value('CompanyFactory', mockupCompanyFactory);
        });

    });

    beforeEach(function() {
        module(function($provide) {
            $provide.value('Positions', mockupPositions);
        });

    });

    beforeEach(function() {
        module(function($provide) {
            $provide.value('uibModal', mockUibModal);
        });

    });

    beforeEach(function() {
        module(function($provide) {
            $provide.value('modalInstance', mockModalInstance);
        });

    });


    // load the controller's module
    beforeEach(module('ocsApp'));

    var PositionsMainCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope,_CompanyFactory_,_uibModal_,_modalInstance_,_Positions_) {
        scope = $rootScope.$new();
        CompanyFactory = _CompanyFactory_;
        uibModal = _uibModal_;
        modalInstance = _modalInstance_;
        Positions = _Positions_;
        PositionsMainCtrl = $controller('MainCtrl', {
            //$uibModal,CompanyFactory,Positions
            $uibModal : uibModal,
            CompanyFactory : CompanyFactory,
            Positions : _Positions_
        });
    }));

    it('should attach a list of awesomeThings to the scope', function () {
        expect(MainCtrl.awesomeThings.length).toBe(3);
    });
});
