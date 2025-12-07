exports.processPayment = async (amount, cardDetails) => {
    // Simulate payment processing delay
    return new Promise((resolve) => {
        setTimeout(() => {
            // Simulate success
            resolve({ success: true, transactionId: 'TXN_' + Date.now() });
        }, 1000);
    });
};

exports.createSubscription = async (planId, cardDetails) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true, subscriptionId: 'SUB_' + Date.now() });
        }, 1000);
    });
};
