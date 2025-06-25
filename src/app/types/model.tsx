export interface Wifi {
  ssid: string;
  bssid: string;
  security: string;
}

export interface Location {
  lat: number;
  lng: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
  number?: number;
  neighborhood?: string;
}

export interface Authorization {
    registerVirtualCard: boolean;
    loan: number;
    pix: number;
    ted: number;
    banksplit: number;
    changePassword: boolean;
}

export interface SafetyPlace {
  _id: string;
  name: string;
  dataInicio: string;
  wifi?: Wifi;
  location?: Location;
  address?: Address;
  authorizationInSafetyPlace?: Authorization
  active: any;
  wifiType: boolean;
  locationType: boolean;
}

export interface UserModel {
  clientId: string
  safetyPlaces: SafetyPlace[]
  authorizationOutSafetyPlace: Authorization
}

export interface ClientGroup {
  clientId: string;
  safetyPlaces: SafetyPlace[];
  authorizationOutSafetyPlace?: Authorization
};