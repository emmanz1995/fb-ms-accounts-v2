import mongoose from 'mongoose';

const accountsSchema = new mongoose.Schema(
  {
    _id: String,
    accountHolderName: String,
    accountNumber: String,
    iban: String,
    balancesMetadata: Object,
    accountType: String,
    currency: String,
    metadata: Object,
  },
  {
    timestamps: true,
  }
);

accountsSchema.index({ accountNumber: 1 }, { unique: true });
accountsSchema.index({ iban: 1 }, { unique: true });

const Accounts = mongoose.model('accounts', accountsSchema);

export default Accounts;
