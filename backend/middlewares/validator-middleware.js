export const validate = (schema) => async (req, res, next) => {
  try {
    const isMultipart = req.headers['content-type']?.includes('multipart/form-data');

    // Combine body + file into one object
    const dataToValidate = {
      ...req.body,
      ...(req.file && { image: req.file }),
    };

    // 🧠 Convert string fields if multipart/form-data (FormData)
    if (isMultipart) {
      // Convert boolean fields
      if ('available' in dataToValidate) {
        dataToValidate.available = dataToValidate.available === 'true';
      }

      // Convert numeric fields
      if ('fees' in dataToValidate) {
        dataToValidate.fees = Number(dataToValidate.fees);
      }

      if ('rating' in dataToValidate) {
        dataToValidate.rating = Number(dataToValidate.rating);
      }

      // Parse address object
      if ('address' in dataToValidate && typeof dataToValidate.address === 'string') {
        try {
          dataToValidate.address = JSON.parse(dataToValidate.address);
        } catch {
          return res.status(400).json({ message: 'Address must be valid JSON.' });
        }
      }

      // Parse slots_booked object
      if ('slots_booked' in dataToValidate && typeof dataToValidate.slots_booked === 'string') {
        try {
          dataToValidate.slots_booked = JSON.parse(dataToValidate.slots_booked);
        } catch {
          return res.status(400).json({ message: 'slots_booked must be valid JSON.' });
        }
      }
    }

    // ✅ Run Zod validation
    const parsedData = await schema.parseAsync(dataToValidate);

    req.body = parsedData;
    next();
  } catch (err) {
    const status = 422;
    const message = err.errors?.[0]?.message || 'Validation error';

    next({ status, message });
  }
};
