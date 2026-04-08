const fallbackCars = [
  {
    _id: "demo-bmw-x5",
    title: "BMW X5 xDrive30d",
    brand: "BMW",
    model: "X5",
    year: 2021,
    price: 4890000,
    location: "Delhi",
    transmission: "Automatic",
    fuelType: "Diesel",
    mileage: 32000,
    images: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80"
    ],
    specs: {
      power: "265 bhp",
      color: "Carbon Black",
      ownerCount: 1
    },
    status: "available",
    verified: true,
    isAuction: true,
    auctionEndsAt: new Date(Date.now() + 1000 * 60 * 60 * 18),
    description: "Luxury SUV with panoramic roof, adaptive suspension, and premium Harman Kardon audio."
  },
  {
    _id: "demo-tesla-model3",
    title: "Tesla Model 3 Long Range",
    brand: "Tesla",
    model: "Model 3",
    year: 2022,
    price: 5690000,
    location: "Bengaluru",
    transmission: "Automatic",
    fuelType: "Electric",
    mileage: 18000,
    images: [
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80"
    ],
    specs: {
      range: "602 km",
      color: "Pearl White",
      ownerCount: 1
    },
    status: "available",
    verified: true,
    isAuction: false,
    description: "A pristine EV with autopilot, glass roof, and dual motor all-wheel drive."
  },
  {
    _id: "demo-audi-a6",
    title: "Audi A6 Premium Plus",
    brand: "Audi",
    model: "A6",
    year: 2020,
    price: 3790000,
    location: "Mumbai",
    transmission: "Automatic",
    fuelType: "Petrol",
    mileage: 41000,
    images: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80"
    ],
    specs: {
      power: "241 bhp",
      color: "Navarra Blue",
      ownerCount: 2
    },
    status: "available",
    verified: true,
    isAuction: true,
    auctionEndsAt: new Date(Date.now() + 1000 * 60 * 60 * 8),
    description: "Executive sedan with digital cockpit, quattro confidence, and sharp premium detailing."
  }
];

export default fallbackCars;
