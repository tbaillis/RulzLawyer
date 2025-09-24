# VBA Code Extraction Script
try {
    Write-Host "🔧 Extracting VBA Code from Rackem19.xlsm..." -ForegroundColor Cyan
    
    $excel = New-Object -ComObject Excel.Application
    $excel.Visible = $false
    $excel.DisplayAlerts = $false
    
    $workbook = $excel.Workbooks.Open("C:\Users\Tim\source\repos\RulzLawyer\examples\Rackem19.xlsm")
    
    # Try to access VBA project
    try {
        $vbProject = $workbook.VBProject
        Write-Host "VBA Project accessible - extracting code..." -ForegroundColor Green
        
        for ($i = 1; $i -le $vbProject.VBComponents.Count; $i++) {
            $component = $vbProject.VBComponents.Item($i)
            $moduleFile = "C:\Users\Tim\source\repos\RulzLawyer\vba_code_$($component.Name).txt"
            
            Write-Host "Extracting module: $($component.Name) ($($component.CodeModule.CountOfLines) lines)"
            
            if ($component.CodeModule.CountOfLines -gt 0) {
                # Extract all code from this module
                $code = $component.CodeModule.Lines(1, $component.CodeModule.CountOfLines)
                $code | Out-File -FilePath $moduleFile -Encoding UTF8
                Write-Host "  Saved to: vba_code_$($component.Name).txt"
            }
        }
        
    } catch {
        Write-Host "VBA access denied or protected. Error: $($_.Exception.Message)" -ForegroundColor Red
        
        # Try alternative approach - examine object model
        Write-Host "Attempting alternative analysis..." -ForegroundColor Yellow
        
        # Look for event handlers and macros indirectly
        $hasEvents = $false
        try {
            # Check if workbook has any event procedures
            foreach ($sheet in $workbook.Worksheets) {
                if ($sheet.CodeName) {
                    Write-Host "Sheet '$($sheet.Name)' has code name: $($sheet.CodeName)"
                    $hasEvents = $true
                }
            }
        } catch {}
        
        if ($hasEvents) {
            Write-Host "Workbook contains VBA code but access is restricted" -ForegroundColor Yellow
        }
    }
    
    $workbook.Close($false)
    $excel.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
    
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}