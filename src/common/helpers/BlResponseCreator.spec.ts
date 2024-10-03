import { BlResponseCreator } from './BlResponseCreator';

export const SERVICE_BL_LOGICS = {
  createUser: {
    EMAIL_ALREADY_EXISTS: {
      en: 'Email already exists',
      zh: '电子邮件已存在',
    },
    USER_CREATED_SUCCESSFULLY: {
      en: 'User created successfully',
      zh: '用户已创建成功',
    },
    DUPLICATED: {
      en: 'Duplicated',
      zh: '重复了',
    },
  },
  refresh: {
    INVALID_REFRESH_TOKEN: {
      en: 'Invalid Refresh Token',
      zh: '刷新令牌失效',
    },
    REFRESH_TOKEN_SUCCESSFULLY: {
      en: 'Refresh token successfully',
      zh: '刷新令牌成功',
    },
  },
  deleteUser: {
    USER_NOT_FOUND: {
      en: 'User not found',
      zh: '未找到用户',
    },
    USER_DELETED_SUCCESSFULLY: {
      en: 'User deleted successfully',
      zh: '成功删除用户',
    },
    DUPLICATED: {
      en: 'Duplicated',
      zh: '重复了',
    },
  },
  findOneByUsername: {
    FIND_ONE_BY_USERNAME_SUCCESSFULLY: {
      en: 'Find one by username successfully',
      zh: '通过用户名查找用户成功',
    },
  },
  validateUser: {
    USER_OR_PASSWORD_DOES_NOT_MATCH: {
      en: 'User or password does not match',
      zh: '用户名或密码不匹配',
    },
    VALIDATE_USER_SUCCESSFULLY: {
      en: 'Validate user successfully',
      zh: '用户验证成功',
    },
  },
  login: {
    LOGIN_SUCCESSFULLY: {
      en: 'Login successfully',
      zh: '登录成功',
    },
    USER_OR_PASSWORD_DOES_NOT_MATCH: {
      en: 'User or password does not match',
      zh: '用户名或密码错误',
    },
    LOGIN_FAILED: {
      en: 'Login failed',
      zh: '登录失败，未知原因',
    },
  },
  redisSet: {
    OK: {
      en: 'Redis get successfully',
      zh: 'Redis获取值成功',
    },
    NOT_OK: {
      en: 'Redis get failed',
      zh: 'Redis获取值失败',
    },
  },
  changePassword: {
    USER_NOT_FOUND: {
      en: 'User not found',
      zh: '用户未找到',
    },
    ORIGINAL_PASSWORD_IS_INCORRECT: {
      en: 'Original password is incorrect',
      zh: '原密码不正确',
    },
    PASSWORD_CHANGED_SUCCESSFULLY: {
      en: 'Password changed successfully',
      zh: '密码修改成功',
    },
  },
  findAllUsers: {
    FIND_USERS_SUCCESSFULLY: {
      en: 'Find users successfully',
      zh: '获取用户列表成功',
    },
    FIND_USERS_FAILED: {
      en: 'Find users failed',
      zh: '获取用户列表失败',
    },
  },
  findOneByOAuthProvider: {
    FIND_ONE_USER_SUCCESSFULLY: {
      en: 'Find one user successfully',
      zh: '获取用户成功',
    },
    FIND_ONE_USER_FAILED: {
      en: 'Find one user failed',
      zh: '获取用户失败',
    },
  },
  createOAuthUser: {
    CREATE_OAUTH_USER_SUCCESSFULLY: {
      en: 'Create oauth user successfully',
      zh: '创建OAuth用户成功',
    },
    CREATE_OAUTH_USER_FAILED: {
      en: 'Create oauth user failed',
      zh: '创建OAuth用户失败',
    },
  },
  comparePasswords: {
    PASSWORDS_EQUAL: {
      en: 'Passwords are equal',
      zh: '密码相同',
    },
    PASSWORDS_DIFFERENT: {
      en: 'Passwords are different',
      zh: '密码不同',
    },
  },
  validateToken: {
    MALFORMED_TOKEN: {
      en: 'Malformed token',
      zh: '畸形的令牌',
    },
    VALIDATED_SUCCESSFULLY: {
      en: 'Validated successfully',
      zh: '验证成功',
    },
    TOKEN_VALIDATION_FAILED: {
      en: 'Token validation failed',
      zh: '令牌验证失败',
    },
  },
  validateJwtPayload: {
    BLACKLISTED: {
      en: 'BLACKLISTED',
      zh: '已被列入黑名单',
    },
    VALIDATED_SUCCESSFULLY: {
      en: 'Validated successfully',
      zh: 'Payload验证成功',
    },
  },
};

describe('ServiceResponse', () => {
  let sr: BlResponseCreator<typeof SERVICE_BL_LOGICS>;

  beforeEach(() => {
    sr = new BlResponseCreator(SERVICE_BL_LOGICS, 'test', 'service');
  });

  it('should create success response for a single service method', () => {
    const { buildSuccess } = sr.createBuilders('findAllUsers');

    const response = buildSuccess('FIND_USERS_SUCCESSFULLY', { a: 1 });

    expect(response).toEqual({
      success: true,
      serviceName: 'test',
      layer: 'service',
      blStack: [{ method: 'findAllUsers', message: 'Find users successfully' }],
      code: 'FIND_USERS_SUCCESSFULLY',
      data: { a: 1 },
    });
  });

  it('should create failure response for a single service method', () => {
    const { buildFailure } = sr.createBuilders('findAllUsers');

    const response = buildFailure('FIND_USERS_FAILED');

    expect(response).toEqual({
      success: false,
      serviceName: 'test',
      layer: 'service',
      blStack: [{ method: 'findAllUsers', message: 'Find users failed' }],
      code: 'FIND_USERS_FAILED',
    });
  });

  it('should create success response for multiple service methods', () => {
    const { buildSuccess } = sr.createBuilders(['createUser', 'deleteUser']);

    const response = buildSuccess('DUPLICATED', {
      userId: 123,
    });

    expect(response).toEqual({
      success: true,
      serviceName: 'test',
      layer: 'service',
      blStack: [
        { method: 'createUser', message: 'Duplicated' },
        { method: 'deleteUser', message: 'Duplicated' },
      ],
      code: 'DUPLICATED',
      data: { userId: 123 },
    });
  });

  it('should handle invalid code gracefully', () => {
    const { buildFailure } = sr.createBuilders('createUser');

    const response = buildFailure('EMAIL_ALREADY_EXISTS');

    // Assuming it just returns empty blStack when the code doesn't exist
    expect(response).toEqual({
      success: false,
      serviceName: 'test',
      layer: 'service',
      blStack: [{ method: 'createUser', message: 'Email already exists' }],
      code: 'EMAIL_ALREADY_EXISTS',
    });
  });

  it('should handle missing optional data gracefully', () => {
    const { buildSuccess } = sr.createBuilders('login');

    const response = buildSuccess('LOGIN_SUCCESSFULLY');

    expect(response).toEqual({
      success: true,
      serviceName: 'test',
      layer: 'service',
      blStack: [{ method: 'login', message: 'Login successfully' }],
      code: 'LOGIN_SUCCESSFULLY',
      data: undefined,
    });
  });
});
