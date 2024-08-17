import numpy as np
from numpy import linalg as LA
from scipy import sparse
class SVD_RS(object):
    def __init__(self, Y_data, K, user_based=1):
        self.Y_data = Y_data
        self.K = K
        self.user_based = user_based
        self.n_users = int(np.max(Y_data[:, 0])) + 1
        self.n_items = int(np.max(Y_data[:, 1])) + 1
        self.n_ratings = Y_data.shape[0]
        self.Ybar_data = self.Y_data.copy().astype(np.float32)
    def normalize_Y(self):
        if self.user_based:
            user_col = 0
            item_col = 1
            n_objects = self.n_users

        # if we want to normalize based on item, just switch first two columns of data
        else:  # item bas
            user_col = 1
            item_col = 0
            n_objects = self.n_items

        users = self.Y_data[:, user_col]
        self.mu = np.zeros((n_objects,))
        for n in range(n_objects):
            # row indices of rating done by user n
            # since indices need to be integers, we need to convert
            ids = np.where(users == n)[0].astype(np.int32)
            # indices of all ratings associated with user n
            item_ids = self.Y_data[ids, 1]
            # and the corresponding ratings
            ratings = self.Y_data[ids, 2].astype(np.float32)
            # take mean
            m = np.mean(ratings)
            if np.isnan(m):
                m = 0  # to avoid empty array and nan value
            self.mu[n] = m
            # normalize
            self.Ybar_data[ids, 2] = ratings - self.mu[n]
        #             print self.Ybar_data

        ################################################
        # form the rating matrix as a sparse matrix. Sparsity is important
        # for both memory and computing efficiency. For example, if #user = 1M,
        # #item = 100k, then shape of the rating matrix would be (100k, 1M),
        # you may not have enough memory to store this. Then, instead, we store
        # nonzeros only, and, of course, their locations.
        self.Ybar = sparse.coo_matrix((self.Ybar_data[:, 2],
                                       (self.Ybar_data[:, 1], self.Ybar_data[:, 0])), (self.n_items, self.n_users))
        self.Ybar = self.Ybar.todense()

    def fit(self):
        """
        matrix factorization using SVD
        """
        self.normalize_Y()
        U, S, V = LA.svd(self.Ybar)
        Uk = U[:, :self.K]
        Sk = S[:self.K]
        Vkt = V[:self.K, :]
        self.res = Uk.dot(np.diag(Sk)).dot(Vkt)

    def pred(self, u, i):
        """
        predict the rating of user u for item i
        if you need the un
        """
        u = int(u)
        i = int(i)

        if self.user_based:
            bias = self.mu[u]
        else:
            bias = self.mu[i]
        pred = self.res[i, u] + bias
        if pred < 1:
            return 1
        if pred > 5:
            return 5
        return pred

    def pred_for_user(self, user_id):
        user_id = int(user_id)

        # Get the items that the user has already rated
        ids = np.where(self.Y_data[:, 0] == user_id)[0]
        # items_rated_by_u = self.Y_data[ids, 1].tolist()
        # Predict ratings for all items
        predicted_ratings = []
        for i in range(self.n_items):
            # if i not in items_rated_by_u:
                rating = self.pred(user_id, i)
                predicted_ratings.append((i, rating))

        return predicted_ratings
    def top_k(self, user_id, k):
        predicted_ratings = self.pred_for_user(user_id)
        sorted_predictions = sorted(predicted_ratings, key=lambda x: x[1], reverse=True)
        top_k_items = sorted_predictions[:k]
        top_k_item_ids = [item[0] + 1 for item in top_k_items]
        return top_k_item_ids
    def evaluate_RMSE(self, rate_test):
        n_tests = rate_test.shape[0]
        SE = 0  # squared error
        for n in range(n_tests):
            pred = self.pred(rate_test[n, 0], rate_test[n, 1])
            SE += (pred - rate_test[n, 2]) ** 2

        RMSE = np.sqrt(SE / n_tests)
        return RMSE
