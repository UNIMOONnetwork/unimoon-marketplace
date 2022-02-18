import axios from '../../utils/axios';

export class TransactionService {
  saveUserTransaction = async (tx: {
    address: string | undefined;
    price: number;
    nft: string;
    type: string;
  }) => {
    if (tx.address) {
      return new Promise((resolve, reject) =>
        axios
          .put(`/rank`, JSON.stringify(tx))
          .then(({ data }) => {
            resolve(data);
          })
          .catch(({ response: { data: err } }) => {
            console.log(err);
            reject(err);
          }),
      );
    }
  };
}

export default new TransactionService();
