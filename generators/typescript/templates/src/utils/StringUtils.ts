declare interface String {
  getInitials(glue?: boolean): string | string[];
  capitalize(): string;
}

String.prototype.getInitials = (glue: boolean = true) => {
  const initials = this.replace(/[^a-zA-Z- ]/g, '').match(/\b\w/g) || [];

  if (glue) {
    return initials.join('');
  }

  return initials;
};

String.prototype.capitalize = function() {
  return this.toLowerCase().replace(/\b\w/g, (m: string) => {
    return m.toUpperCase();
  });
};
