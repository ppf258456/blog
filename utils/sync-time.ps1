# 检查当前系统时间
Write-Output "Current system time:"
Get-Date

# 检查当前NTP配置
Write-Output "Current NTP configuration:"
w32tm /query /status

# 强制重新同步系统时间
Write-Output "Resynchronizing system time..."
w32tm /resync

# 检查重新同步后的系统时间
Write-Output "System time after resync:"
Get-Date
