import * as yup from 'yup';

export const validationSchema = yup.object({
    name: yup.string().required(),
    date: yup.date().required().max(new Date(), "Future date not allowed"),
    categoryId: yup.number().required(),
    totalPrice: yup.number().required().moreThan(0),
    quantity: yup.number().required('Please enter quantity').min(1),
    unit: yup.number().required(),
})
