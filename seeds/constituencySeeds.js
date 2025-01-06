const mongoose = require('mongoose');
const Constituency = require('../models/Constituency');

const constituencies = [
    {
        name: "Dhaka-1",
        division: "Dhaka",
        district: "Dhaka",
        code: "DH-01",
        coordinates: {
            type: "Point",
            coordinates: [90.4125, 23.8103] // Dhaka coordinates
        },
        demographics: {
            totalPopulation: 350000,
            voterCount: 250000,
            literacyRate: 78.5,
            malePopulation: 180000,
            femalePopulation: 170000,
            avgIncome: 45000
        },
        currentRepresentative: {
            name: "Mohammad Mahdi Hasan Dipu",
            party: "Bangladesh Pure Democratic Party",
            startTerm: new Date("2024-01-01"),
            endTerm: new Date("2029-01-01"),
            contactInfo: {
                email: "mahdi.dipu@parliament.gov.bd",
                phone: "+880-1700-000001",
                office: "Parliament Building, Dhaka"
            }
        },
        performance: {
            attendanceRate: 85,
            projectsCompleted: 75,
            fundUtilization: 90,
            publicSatisfaction: 80
        }
    },
    {
        name: "Chittagong-1",
        division: "Chittagong",
        district: "Chittagong",
        code: "CH-01",
        coordinates: {
            type: "Point",
            coordinates: [91.8340, 22.3569] // Chittagong coordinates
        },
        demographics: {
            totalPopulation: 320000,
            voterCount: 230000,
            literacyRate: 76.2,
            malePopulation: 165000,
            femalePopulation: 155000,
            avgIncome: 42000
        },
        currentRepresentative: {
            name: "Fatima Rahman",
            party: "Bangladesh Pure Democratic Party",
            startTerm: new Date("2024-01-01"),
            endTerm: new Date("2029-01-01"),
            contactInfo: {
                email: "fatima.rahman@parliament.gov.bd",
                phone: "+880-1700-000002",
                office: "City Corporation Building, Chittagong"
            }
        },
        performance: {
            attendanceRate: 88,
            projectsCompleted: 70,
            fundUtilization: 85,
            publicSatisfaction: 75
        }
    },
    {
        name: "Sylhet-1",
        division: "Sylhet",
        district: "Sylhet",
        code: "SY-01",
        coordinates: {
            type: "Point",
            coordinates: [91.8687, 24.8949] // Sylhet coordinates
        },
        demographics: {
            totalPopulation: 280000,
            voterCount: 200000,
            literacyRate: 75.8,
            malePopulation: 142000,
            femalePopulation: 138000,
            avgIncome: 40000
        },
        currentRepresentative: {
            name: "Mohammad Ali",
            party: "Bangladesh Pure Democratic Party",
            startTerm: new Date("2024-01-01"),
            endTerm: new Date("2029-01-01"),
            contactInfo: {
                email: "mohammad.ali@parliament.gov.bd",
                phone: "+880-1700-000003",
                office: "City Corporation Building, Sylhet"
            }
        },
        performance: {
            attendanceRate: 82,
            projectsCompleted: 65,
            fundUtilization: 80,
            publicSatisfaction: 72
        }
    },
    {
        name: "Rajshahi-1",
        division: "Rajshahi",
        district: "Rajshahi",
        code: "RJ-01",
        coordinates: {
            type: "Point",
            coordinates: [88.6042, 24.3745] // Rajshahi coordinates
        },
        demographics: {
            totalPopulation: 290000,
            voterCount: 210000,
            literacyRate: 77.5,
            malePopulation: 148000,
            femalePopulation: 142000,
            avgIncome: 38000
        },
        currentRepresentative: {
            name: "Nusrat Jahan",
            party: "Bangladesh Pure Democratic Party",
            startTerm: new Date("2024-01-01"),
            endTerm: new Date("2029-01-01"),
            contactInfo: {
                email: "nusrat.jahan@parliament.gov.bd",
                phone: "+880-1700-000004",
                office: "City Corporation Building, Rajshahi"
            }
        },
        performance: {
            attendanceRate: 86,
            projectsCompleted: 72,
            fundUtilization: 88,
            publicSatisfaction: 78
        }
    }
];

async function seedConstituencies() {
    try {
        // Clear existing constituencies
        await Constituency.deleteMany({});
        
        // Insert new constituencies
        await Constituency.insertMany(constituencies);
        
        console.log('Constituencies seeded successfully!');
    } catch (error) {
        console.error('Error seeding constituencies:', error);
    }
}

module.exports = seedConstituencies;
