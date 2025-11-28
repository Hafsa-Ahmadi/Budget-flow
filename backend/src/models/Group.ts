import mongoose, { Document, Schema } from 'mongoose';

export interface IGroupMember {
  userId: mongoose.Types.ObjectId;
  role: 'admin' | 'member';
  joinedAt: Date;
}

export interface IGroup extends Document {
  name: string;
  description?: string;
  members: IGroupMember[];
  createdBy: mongoose.Types.ObjectId;
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const groupMemberSchema = new Schema<IGroupMember>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['admin', 'member'],
      default: 'member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const groupSchema = new Schema<IGroup>(
  {
    name: {
      type: String,
      required: [true, 'Group name is required'],
      trim: true,
      minlength: [3, 'Group name must be at least 3 characters'],
      maxlength: [50, 'Group name cannot exceed 50 characters']
    },
    description: {
      type: String,
      maxlength: [200, 'Description cannot exceed 200 characters'],
      default: null
    },
    members: {
      type: [groupMemberSchema],
      required: true,
      validate: {
        validator: function (members: IGroupMember[]) {
          return members.length > 0;
        },
        message: 'Group must have at least one member'
      }
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    avatar: {
      type: String,
      default: null
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for member count
groupSchema.virtual('memberCount').get(function () {
  return this.members.length;
});

// Index for faster queries
groupSchema.index({ 'members.userId': 1 });
groupSchema.index({ createdBy: 1 });
groupSchema.index({ isActive: 1 });

const Group = mongoose.model<IGroup>('Group', groupSchema);

export default Group;