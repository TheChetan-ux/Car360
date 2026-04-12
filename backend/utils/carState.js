const INSPECTION_STATUSES = new Set(["pending", "verified", "rejected"]);
const DOCUMENT_STATUSES = new Set(["pending", "verified", "rejected"]);
const AVAILABILITY_STATUSES = new Set(["available", "sold", "reserved"]);
const AUCTION_STATUSES = new Set(["active", "ended"]);
const PRIVILEGED_ROLES = new Set(["admin", "seller", "dealer", "inspector"]);

export const getInspectionStatus = (car = {}) => {
  if (INSPECTION_STATUSES.has(car.status)) {
    return car.status;
  }

  return car.verified ? "verified" : "pending";
};

export const getAvailabilityStatus = (car = {}) => {
  if (AVAILABILITY_STATUSES.has(car.availabilityStatus)) {
    return car.availabilityStatus;
  }

  if (AVAILABILITY_STATUSES.has(car.status)) {
    return car.status;
  }

  return "available";
};

export const getAuctionEndTime = (car = {}) => {
  return car.auctionEndTime || car.auctionEndsAt || null;
};

export const getAuctionStatus = (car = {}) => {
  if (!car.isAuction) {
    return "ended";
  }

  if (AUCTION_STATUSES.has(car.auctionStatus)) {
    const endTime = getAuctionEndTime(car);

    if (endTime && new Date(endTime).getTime() <= Date.now()) {
      return "ended";
    }

    return car.auctionStatus;
  }

  const endTime = getAuctionEndTime(car);
  return endTime && new Date(endTime).getTime() <= Date.now() ? "ended" : "active";
};

export const normalizeDocuments = (documents = {}) => ({
  rc: documents?.rc || "",
  insurance: documents?.insurance || "",
  idProof: documents?.idProof || "",
});

export const getDocumentStatus = (car = {}) => {
  if (DOCUMENT_STATUSES.has(car.documentStatus)) {
    return car.documentStatus;
  }

  return getInspectionStatus(car) === "verified" ? "verified" : "pending";
};

export const hasAllRequiredDocuments = (car = {}) => {
  const documents = normalizeDocuments(car.documents);
  return Boolean(documents.rc && documents.insurance && documents.idProof);
};

export const normalizeCar = (car) => {
  if (!car) {
    return null;
  }

  const value = typeof car.toObject === "function" ? car.toObject() : { ...car };
  const status = getInspectionStatus(value);
  const documentStatus = getDocumentStatus(value);
  const availabilityStatus = getAvailabilityStatus(value);
  const auctionEndTime = getAuctionEndTime(value);
  const auctionStatus = getAuctionStatus(value);

  return {
    ...value,
    documents: normalizeDocuments(value.documents),
    status,
    documentStatus,
    availabilityStatus,
    auctionEndTime,
    auctionStatus,
    verified: status === "verified",
  };
};

export const isListingApproved = (car) => {
  const normalizedCar = normalizeCar(car);

  if (!normalizedCar) {
    return false;
  }

  return normalizedCar.status === "verified" && normalizedCar.documentStatus === "verified";
};

export const canManageAllCars = (user) => PRIVILEGED_ROLES.has(user?.role);

export const canViewCarDetails = (user, car) => {
  const normalizedCar = normalizeCar(car);

  if (!normalizedCar) {
    return false;
  }

  if (canManageAllCars(user)) {
    return true;
  }

  return isListingApproved(normalizedCar);
};

export const filterMarketplaceCars = (cars, user) => {
  const normalizedCars = cars.map(normalizeCar).filter(Boolean);

  if (canManageAllCars(user)) {
    return normalizedCars;
  }

  return normalizedCars.filter(
    (car) => isListingApproved(car) && car.availabilityStatus === "available"
  );
};
