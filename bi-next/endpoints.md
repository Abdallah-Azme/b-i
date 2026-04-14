# B&I API Endpoints Integration Status

- [x] v1/auth/login/Login: POST {{baseUrl}}/v1/auth/login
- [x] v1/auth/register/investor/Register: POST {{baseUrl}}/v1/auth/register/investor
- [x] v1/auth/register/advertiser/Register: POST {{baseUrl}}/v1/auth/register/advertiser
- [ ] v1/auth/Verify Code/verify Code: POST {{baseUrl}}/v1/auth/verify-code
- [ ] v1/auth/Resend Code/Resend Code: POST {{baseUrl}}/v1/auth/resend-code
- [ ] v1/auth/Logout/Logout: POST {{baseUrl}}/v1/auth/logout
- [ ] v1/general/Home/Home: GET {{baseUrl}}/v1/general/home-page
- [ ] v1/general/categories/index: GET {{baseUrl}}/v1/general/categories
- [ ] v1/general/investor-types/List investor types: GET {{baseUrl}}/v1/general/investor-types
- [ ] v1/general/investor-experience/List investor experience levels: GET {{baseUrl}}/v1/general/investor-experience
- [ ] v1/general/preferred-sectors/List active preferred sectors (id + name): GET {{baseUrl}}/v1/general/preferred-sectors
- [ ] v1/general/Who we are/who-we-are: GET {{baseUrl}}/v1/general/who-we-are
- [ ] v1/general/privacy-policy/privacy-policy: GET {{baseUrl}}/v1/general/privacy-policy
- [ ] v1/general/terms-and-conditions/terms-and-conditions: GET {{baseUrl}}/v1/general/terms-and-conditions
- [ ] v1/general/Change Lang/Change Lang: GET {{baseUrl}}/v1/general/change-lang?device_token=&lang=ar
- [x] v1/general/investors/List investors (public directory): GET {{baseUrl}}/v1/general/investors?investor_type=angel&min_capital=60000&page=1&per_page=10
- [ ] v1/general/packages/packages: GET {{baseUrl}}/v1/general/packages
- [ ] v1/general/opportunities/opportunities: GET {{baseUrl}}/v1/general/opportunities
- [ ] v1/general/Notifications/Get Notification Settings: GET {{baseUrl}}/v1/auth/notification-settings
- [ ] v1/general/Notifications/Update Notification Settings: PATCH {{baseUrl}}/v1/auth/notification-settings
- [ ] v1/general/Change Password/Change Password: PATCH {{baseUrl}}/v1/auth/password
- [ ] v1/general/Change Email/Resend Email OTP: POST {{baseUrl}}/v1/auth/email-change/request-current
- [ ] v1/general/Change Email/Request Current Email OTP: POST {{baseUrl}}/v1/auth/email-change/request-current
- [ ] v1/general/Change Email/Verify Current Email OTP: POST {{baseUrl}}/v1/auth/email-change/verify-current
- [ ] v1/general/Change Email/Request New Email OTP || Resend: POST {{baseUrl}}/v1/auth/email-change/request-new
- [ ] v1/general/Change Email/Verify New Email OTP: POST {{baseUrl}}/v1/auth/email-change/verify-new
- [ ] v1/general/Forget Password/Forgot Password Code || Resend: POST {{baseUrl}}/v1/auth/password/forgot/request-code
- [ ] v1/general/Forget Password/Verify Forgot Password Code: POST {{baseUrl}}/v1/auth/password/forgot/verify-code
- [ ] v1/general/Forget Password/Reset Forgotten Password: POST {{baseUrl}}/v1/auth/password/forgot/reset
- [x] v1/logic/company/Opportunities/Create Opportunity - Request Investment: POST {{baseUrl}}/v1/company/opportunities
- [ ] v1/logic/company/Opportunities/opportunity details: GET {{baseUrl}}/v1/company/opportunities/:id
- [x] v1/logic/company/Opportunities/opportunities: GET {{baseUrl}}/v1/company/opportunities

### Unlisted but Implemented:
- [x] GET {{baseUrl}}/v1/company/opportunities/requests
- [x] GET {{baseUrl}}/v1/auth/me
- [x] GET {{baseUrl}}/v1/notifications
