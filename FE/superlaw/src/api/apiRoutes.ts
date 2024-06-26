const apiRoutes = {
    cities: 'SimpleData/Cities',
    legalCategories: 'SimpleData/LegalCategories',
    judicialRegions: 'SimpleData/JudicialRegions',
    registerUser: 'Auth/RegisterUser',
    registerLawyer: 'Auth/RegisterLawyer',
    login: 'Auth/Login',
    forgotPassword: 'Auth/ForgotPassword',
    resetPassword: 'Auth/ResetPassword',
    confirmEmail: 'Auth/ConfirmEmail',
    phoneVerification: 'Auth/PhoneVerification',
    confirmPhone: 'Auth/ConfirmPhone',
    uploadPicture: 'Profile/UploadPicture',
    createProfile: 'Profile/Create',
    editProfile: 'Profile/Edit',
    ownProfile: 'Profile/Own',
    profile: 'Profile/Get',
    ownProfileDataForEdit: 'Profile/OwnDataForEdit',
    allProfiles: 'Profile/GetAll',
    createMeeting: 'Meeting/Create',
    rateMeeting: 'Meeting/Rate',
    meetingsForUser: 'Meeting/GetAllForUser'
};

export default apiRoutes;