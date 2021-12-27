import User from "../../../common/models/users.model";
import debug from "debug";
import { PermissionFlag } from "../../../common/middleware/common.permissionflag.enum";
const log: debug.IDebugger = debug("app:users-dao");

class UsersDao {
  constructor() {
    log("Created new instance of UsersDao");
  }
  //create new user.
  async save(body: any) {
    const user = new User({
      ...body,
      permissionFlags: PermissionFlag.USER
    });
    let data = await user.save();
    return data;
  }
  //Update user by id.
  async put(userId: string, body: any) {
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { $set: body },
      { new: true }
    ).exec();
    return user;
  }
  //Get user list with pagination
  async find(userId: string) {
    let user = await User.findById(userId, 'firstName lastName email');
    return user;
  }
  async changePasswordWithEmail(email: string, body: any) {
    const user = await User.findOneAndUpdate(
      { email: email },
      { $set: body },
      { new: true }
    ).exec();
    return user;
  }






}

export default new UsersDao();
