import * as yup from 'yup';

export const validationSchema = yup.object({
    name: yup.string().required(),
    date: yup.date().required().max(new Date(), "Future date not allowed"),
    categoryId: yup.number().nullable(true).transform((_, val) => val === Number(val) ? val : null) ,
    shopId: yup.number().nullable(true).transform((_, val) => val === Number(val) ? val : null) ,
    totalPrice: yup.number().required().moreThan(0),
    quantity: yup.number().required('Please enter quantity').min(1),
    unit: yup.number().required(),
})
