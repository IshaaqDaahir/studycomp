export const validateField = (name: string, value: string): string => {
  switch (name) {
    case 'email':
      if (!value) return 'Email is required';
      if (!/\S+@\S+\.\S+/.test(value)) return 'Please enter a valid email';
      return '';
    
    case 'password':
    case 'password1':
      if (!value) return 'Password is required';
      if (value.length < 8) return 'Password must be at least 8 characters';
      return '';
    
    case 'password2':
      if (!value) return 'Please confirm your password';
      return '';
    
    case 'name':
      if (!value) return 'Full name is required';
      if (value.length < 2) return 'Name must be at least 2 characters';
      return '';
    
    case 'username':
      if (!value) return 'Username is required';
      if (value.length < 3) return 'Username must be at least 3 characters';
      if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Username can only contain letters, numbers, and underscores';
      return '';
    
    case 'room-name':
      if (!value) return 'Room name is required';
      if (value.length < 3) return 'Room name must be at least 3 characters';
      return '';
    
    case 'room-topic':
      if (!value) return 'Topic is required';
      return '';
    
    case 'bio':
      if (!value) return 'Bio is required';
      if (value.length < 10) return 'Bio must be at least 10 characters';
      return '';
    
    default:
      return '';
  }
};

export const validatePasswordMatch = (password1: string, password2: string): string => {
  if (password1 && password2 && password1 !== password2) {
    return 'Passwords do not match';
  }
  return '';
};