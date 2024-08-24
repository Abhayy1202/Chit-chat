export class UserDetails {
  constructor({ name, email, phone, address }) {
    this.id = Date.now().toString();
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.address = address;
  }
}
