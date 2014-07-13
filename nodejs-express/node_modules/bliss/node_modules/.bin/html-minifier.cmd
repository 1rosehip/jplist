@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\..\html-minifier\cli.js" %*
) ELSE (
  node  "%~dp0\..\html-minifier\cli.js" %*
)