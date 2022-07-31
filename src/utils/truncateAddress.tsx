export const truncateAddress = (address: string) => {
  address =
    address.substring(0, 12) +
    "..." +
    address.substring(address.length - 8, address.length);
  return address;
};

export const shorten = (input: string) => {
  if (typeof input === "undefined") {
    return "";
  }
  return input.length > 12 ? input.substring(0, 12) + "..." : input;
};
