export const getShortAddress = (address?: string) => {
  return address?.slice(0, 15) + '...' + address?.slice(address.length - 4)
}
