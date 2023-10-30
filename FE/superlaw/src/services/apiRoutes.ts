const apiRoutes = {
    cities: 'SimpleData/Cities',
    legalCategories: 'SimpleData/LegalCategories',
    judicialRegions: 'SimpleData/JudicialRegions',
    registerUser: 'Auth/RegisterUser',
    registerLawyer: 'Auth/RegisterLawyer',
    login: 'Auth/Login',
    forgotPassword: 'Auth/ForgotPassword',
    confirmEmail: 'Auth/ConfirmEmail',
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