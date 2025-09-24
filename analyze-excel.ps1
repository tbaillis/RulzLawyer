# Excel Analysis Script for Rackem19.xlsm
param(
    [string]$FilePath = "C:\Users\Tim\source\repos\RulzLawyer\examples\Rackem19.xlsm"
)

try {
    Write-Host "🔍 Analyzing Excel file: $FilePath" -ForegroundColor Cyan
    
    # Create Excel Application
    $excel = New-Object -ComObject Excel.Application
    $excel.Visible = $false
    $excel.DisplayAlerts = $false
    
    # Open workbook
    $workbook = $excel.Workbooks.Open($FilePath)
    
    Write-Host "`n📊 WORKBOOK ANALYSIS" -ForegroundColor Yellow
    Write-Host "================================"
    Write-Host "File: $($workbook.Name)"
    Write-Host "Author: $($workbook.BuiltInDocumentProperties.Item('Author').Value)"
    Write-Host "Last Modified: $($workbook.BuiltInDocumentProperties.Item('Last Save Time').Value)"
    Write-Host "Total Worksheets: $($workbook.Worksheets.Count)"
    
    # Analyze worksheets
    Write-Host "`n📋 WORKSHEETS FOUND:" -ForegroundColor Green
    foreach ($worksheet in $workbook.Worksheets) {
        Write-Host "  • $($worksheet.Name) (Index: $($worksheet.Index))" -ForegroundColor White
        
        # Get used range info
        if ($worksheet.UsedRange) {
            $rows = $worksheet.UsedRange.Rows.Count
            $cols = $worksheet.UsedRange.Columns.Count
            Write-Host "    - Used Range: $rows rows x $cols columns" -ForegroundColor Gray
        }
    }
    
    # Check for VBA code
    Write-Host "`n🔧 VBA MODULES ANALYSIS:" -ForegroundColor Magenta
    if ($workbook.VBProject) {
        foreach ($component in $workbook.VBProject.VBComponents) {
            Write-Host "  • Module: $($component.Name) (Type: $($component.Type))" -ForegroundColor White
            
            # Count lines of code
            if ($component.CodeModule.CountOfLines -gt 0) {
                Write-Host "    - Lines of code: $($component.CodeModule.CountOfLines)" -ForegroundColor Gray
                
                # Get first few lines to understand what the module does
                if ($component.CodeModule.CountOfLines -ge 5) {
                    Write-Host "    - First few lines:" -ForegroundColor Gray
                    for ($i = 1; $i -le [Math]::Min(5, $component.CodeModule.CountOfLines); $i++) {
                        $line = $component.CodeModule.Lines($i, 1).Trim()
                        if ($line -and -not $line.StartsWith("'")) {
                            Write-Host "      $line" -ForegroundColor DarkGray
                        }
                    }
                }
            }
        }
    }
    
    # Analyze first worksheet in detail
    if ($workbook.Worksheets.Count -gt 0) {
        $firstSheet = $workbook.Worksheets.Item(1)
        Write-Host "`n🎯 DETAILED ANALYSIS OF '$($firstSheet.Name)':" -ForegroundColor Red
        
        # Look for form controls
        Write-Host "  Form Controls:" -ForegroundColor Yellow
        foreach ($shape in $firstSheet.Shapes) {
            Write-Host "    • $($shape.Name) - Type: $($shape.Type)" -ForegroundColor White
        }
        
        # Sample some cell values to understand structure
        Write-Host "`n  Sample Cell Values (A1:J10):" -ForegroundColor Yellow
        for ($row = 1; $row -le 10; $row++) {
            $rowData = @()
            for ($col = 1; $col -le 10; $col++) {
                $cell = $firstSheet.Cells.Item($row, $col)
                if ($cell.Value2) {
                    $rowData += "$([char](64 + $col))$row`: $($cell.Value2)"
                }
            }
            if ($rowData.Count -gt 0) {
                Write-Host "    Row $row`: $($rowData -join ' | ')" -ForegroundColor Gray
            }
        }
    }
    
    Write-Host "`n✅ Analysis complete!" -ForegroundColor Green
    
}
catch {
    Write-Error "Failed to analyze Excel file: $($_.Exception.Message)"
}
finally {
    # Cleanup
    if ($workbook) { $workbook.Close($false) }
    if ($excel) { 
        $excel.Quit()
        [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
    }
}