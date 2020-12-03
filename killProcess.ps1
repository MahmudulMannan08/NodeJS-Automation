# PowerShell Kill Process

[CmdletBinding()]
Param(
	[Parameter(Mandatory=$True)]
	[string]$ProcessName
)

$process = Get-Process $ProcessName -ErrorAction SilentlyContinue
taskkill /im chromedriver.exe /f 


if ($process -ne $null)
{
	$process.Kill()
}