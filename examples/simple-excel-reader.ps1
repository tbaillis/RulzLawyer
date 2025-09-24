# Simple Excel Reader
try {
    Write-Host "Opening Excel file..." -ForegroundColor Green
    $excel = New-Object -ComObject Excel.Application
    $excel.Visible = $false
    $workbook = $excel.Workbooks.Open("C:\Users\Tim\source\repos\RulzLawyer\examples\Rackem19.xlsm")
    
    Write-Host "Worksheets:" -ForegroundColor Yellow
    for ($i = 1; $i -le $workbook.Worksheets.Count; $i++) {
        $ws = $workbook.Worksheets.Item($i)
        Write-Host "  $i. $($ws.Name)"
    }
    
    # Try to get VBA modules
    Write-Host "`nVBA Modules:" -ForegroundColor Yellow
    try {
        $vbProject = $workbook.VBProject
        for ($i = 1; $i -le $vbProject.VBComponents.Count; $i++) {
            $component = $vbProject.VBComponents.Item($i)
            Write-Host "  - $($component.Name) (Lines: $($component.CodeModule.CountOfLines))"
        }
    }
    catch {
        Write-Host "  VBA access restricted or not available"
    }
    
    $workbook.Close($false)
    $excel.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
    
}
catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}