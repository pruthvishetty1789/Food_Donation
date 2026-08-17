function otpVerificationTemplate(name, otp, type) {
  const titleText =
    type === "verification" ? "Email Verification" : "Password Reset";

  const messageText =
    type === "verification"
      ? "Welcome to SharePlate. To get started, please use the following OTP to verify your email address and complete your registration process."
      : "To reset your password, please use the following OTP code. If you did not request this password reset, please ignore this email.";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${titleText} - SharePlate</title>

<style>
body{
    margin:0;
    padding:0;
    font-family:Arial, Helvetica, sans-serif;
    background:#f5f5f5;
}

.container{
    max-width:600px;
    margin:30px auto;
    background:#ffffff;
    border-radius:10px;
    overflow:hidden;
    box-shadow:0 0 10px rgba(0,0,0,.1);
}

.header{
    text-align:center;
    padding:20px;
    background:#2E7D32;
    color:white;
}

.icon-wrapper{
    text-align:center;
    margin-top:20px;
}

.icon-wrapper span{
    display:inline-block;
    background:#C8E6C9;
    padding:15px;
    border-radius:50%;
}

.main-content{
    padding:30px;
}

.main-content h1{
    color:#2E7D32;
    text-align:center;
}

.main-content p{
    color:#555;
    font-size:16px;
    line-height:1.7;
}

.otp-container{
    text-align:center;
    margin:30px 0;
}

.otp-box{
    display:inline-block;
    width:45px;
    height:50px;
    line-height:50px;
    margin:5px;
    font-size:24px;
    font-weight:bold;
    border-radius:6px;
    background:#E8F5E9;
    border:1px solid #4CAF50;
    color:#2E7D32;
}

.footer{
    text-align:center;
    background:#F5F5F5;
    padding:20px;
    font-size:13px;
    color:#666;
}
</style>

</head>

<body>

<div class="container">

    <div class="header">
        <h2>
            Share<span style="color:#A5D6A7;">Plate</span>
        </h2>
    </div>

    <div class="icon-wrapper">
        <span>
            <svg xmlns="http://www.w3.org/2000/svg"
                 width="24"
                 height="24"
                 viewBox="0 0 24 24"
                 fill="#2E7D32">
                <path d="M20 4H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zm0 2v.511l-8 6.223-8-6.222V6h16zM4 18V9.044l7.386 5.745a.994.994 0 001.228 0L20 9.044V18H4z"/>
            </svg>
        </span>
    </div>

    <div class="main-content">

        <h1>${titleText}</h1>

        <p>
            Hello <strong>${name}</strong>,
            <br><br>
            ${messageText}
        </p>

        <div class="otp-container">

            ${otp
              .split("")
              .map(
                (digit) =>
                  `<span class="otp-box">${digit}</span>`
              )
              .join("")}

        </div>

        <p style="text-align:center;">
            This OTP is valid for <strong>5 minutes</strong>.
        </p>

    </div>

    <div class="footer">
        <p>
            This is an automated email from <strong>SharePlate</strong>.<br>
            Please do not reply to this message.
        </p>

        <p>
            If you did not request this email, you can safely ignore it.
        </p>
    </div>

</div>

</body>
</html>
`;
}

module.exports = otpVerificationTemplate;