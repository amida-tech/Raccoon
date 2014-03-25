 {
      name: {
        prefix: prefix,
        given: given,
        family: family
      },
      dob: dob,
      gender: gender,
      marital_status: marital_status,
      address: {
       street: street,
        city: city,
        state: state,
        zip: zip,
        country: country
      },
      phone: {
        home: home,
        work: work,
        mobile: mobile
      },
      email: email,
      language: language,
      race: race,
      ethnicity: ethnicity,
      religion: religion,
      birthplace: {
        state: birthplace_state,
        zip: birthplace_zip,
        country: birthplace_country
      },
      guardian: {
        name: {
          given: guardian_given,
          family: guardian_family
        },
        relationship: guardian_relationship,
        address: {
          street: guardian_street,
          city: guardian_city,
          state: guardian_state,
          zip: guardian_zip,
          country: guardian_country
        },
        phone: {
          home: guardian_home
        }
      },
      provider: {
        organization: provider_organization,
        phone: provider_phone,
        address: {
          street: provider_street,
          city: provider_city,
          state: provider_state,
          zip: provider_zip,
          country: provider_country
        }
      }
    };