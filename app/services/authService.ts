// app/services/authService.ts
import { 
  auth,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  sendPasswordResetEmail
} from '../../firebase/firebaseConfig';

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: any;
}

export const authService = {
  // Đổi mật khẩu với Firebase
  async changePassword(data: ChangePasswordRequest): Promise<AuthResponse> {
    try {
      const user = auth.currentUser;
      
      if (!user || !user.email) {
        return {
          success: false,
          error: 'Người dùng chưa đăng nhập'
        };
      }

      // 1. Xác thực lại người dùng với mật khẩu cũ
      const credential = EmailAuthProvider.credential(
        user.email,
        data.currentPassword
      );
      
      await reauthenticateWithCredential(user, credential);
      
      // 2. Cập nhật mật khẩu mới
      await updatePassword(user, data.newPassword);
      
      return {
        success: true,
        message: 'Mật khẩu đã được thay đổi thành công'
      };
      
    } catch (error: any) {
      console.error('Lỗi khi đổi mật khẩu:', error);
      
      let errorMessage = 'Đã xảy ra lỗi khi đổi mật khẩu';
      
      switch (error.code) {
        case 'auth/wrong-password':
          errorMessage = 'Mật khẩu hiện tại không chính xác';
          break;
        case 'auth/weak-password':
          errorMessage = 'Mật khẩu mới quá yếu (ít nhất 6 ký tự)';
          break;
        case 'auth/requires-recent-login':
          errorMessage = 'Vui lòng đăng nhập lại để thay đổi mật khẩu';
          break;
        case 'auth/user-not-found':
          errorMessage = 'Người dùng không tồn tại';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Quá nhiều yêu cầu. Vui lòng thử lại sau';
          break;
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  },

  // Quên mật khẩu - Gửi email reset
  async forgotPassword(email: string): Promise<AuthResponse> {
    try {
      await sendPasswordResetEmail(auth, email);
      
      return {
        success: true,
        message: 'Email đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư của bạn.'
      };
    } catch (error: any) {
      console.error('Lỗi khi gửi email reset:', error);
      
      let errorMessage = 'Không thể gửi email đặt lại mật khẩu';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'Email không tồn tại trong hệ thống';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Email không hợp lệ';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Quá nhiều yêu cầu. Vui lòng thử lại sau';
          break;
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  },

  // Lấy thông tin user hiện tại
  getCurrentUser() {
    return auth.currentUser;
  }
};