# Extract Cell Formatting and Layout Information
try {
    Write-Host "🎨 Analyzing Visual Design and Layout of Rackem19.xlsm..." -ForegroundColor Cyan
    
    $excel = New-Object -ComObject Excel.Application
    $excel.Visible = $false
    $workbook = $excel.Workbooks.Open("C:\Users\Tim\source\repos\RulzLawyer\examples\Rackem19.xlsm")
    
    # Analyze Character Sheet I layout and formatting
    $sheet1 = $workbook.Worksheets.Item("Character Sheet I")
    
    Write-Host "`n📋 CHARACTER SHEET I - Visual Design Analysis" -ForegroundColor Yellow
    Write-Host "=" * 50
    
    # Check page setup and print areas
    Write-Host "Page Setup:"
    Write-Host "  Orientation: $($sheet1.PageSetup.Orientation)"
    Write-Host "  Paper Size: $($sheet1.PageSetup.PaperSize)"
    try {
        Write-Host "  Print Area: $($sheet1.PageSetup.PrintArea)"
    } catch {}
    
    # Analyze key regions for formatting patterns
    $regions = @(
        @{Name="Header"; StartRow=1; EndRow=10; StartCol=1; EndCol=30},
        @{Name="Abilities"; StartRow=15; EndRow=35; StartCol=1; EndCol=15},
        @{Name="Combat"; StartRow=35; EndRow=55; StartCol=1; EndCol=20},
        @{Name="Skills"; StartRow=60; EndRow=100; StartCol=1; EndCol=25}
    )
    
    foreach ($region in $regions) {
        Write-Host "`nRegion: $($region.Name)"
        Write-Host "----------------------------------------"
        
        # Sample formatting from this region
        $sampleCells = @()
        for ($r = $region.StartRow; $r -le [Math]::Min($region.EndRow, $region.StartRow + 5); $r++) {
            for ($c = $region.StartCol; $c -le [Math]::Min($region.EndCol, $region.StartCol + 5); $c++) {
                $cell = $sheet1.Cells.Item($r, $c)
                if ($cell.Value2) {
                    $cellInfo = @{
                        Address = $cell.Address($false, $false)
                        Value = $cell.Value2
                        FontSize = $cell.Font.Size
                        FontBold = $cell.Font.Bold
                        BackColor = $cell.Interior.Color
                        HasBorder = $cell.Borders.LineStyle -ne -4142
                    }
                    $sampleCells += $cellInfo
                }
            }
        }
        
        # Display formatting patterns
        foreach ($cell in $sampleCells[0..2]) {
            Write-Host "  $($cell.Address): '$($cell.Value)' - Font: $($cell.FontSize)pt" -NoNewline
            if ($cell.FontBold) { Write-Host " BOLD" -NoNewline }
            if ($cell.HasBorder) { Write-Host " BORDERED" -NoNewline }
            if ($cell.BackColor -ne 16777215) { Write-Host " COLORED" -NoNewline }
            Write-Host ""
        }
    }
    
    # Check for merged cells and special formatting
    Write-Host "`n🎯 Special Formatting Elements:" -ForegroundColor Green
    
    $mergedCells = 0
    $coloredCells = 0
    $borderedCells = 0
    
    # Sample a reasonable range to avoid performance issues
    for ($r = 1; $r -le 100; $r++) {
        for ($c = 1; $c -le 30; $c++) {
            $cell = $sheet1.Cells.Item($r, $c)
            
            if ($cell.MergeCells) { $mergedCells++ }
            if ($cell.Interior.Color -ne 16777215) { $coloredCells++ }
            if ($cell.Borders.LineStyle -ne -4142) { $borderedCells++ }
        }
    }
    
    Write-Host "  Merged Cells Found: $mergedCells"
    Write-Host "  Colored Cells: $coloredCells"  
    Write-Host "  Bordered Cells: $borderedCells"
    
    # Analyze other character sheets
    $otherSheets = @("Character Sheet II", "Character Sheet III", "Character Sheet IV", "Character Sheet V")
    
    foreach ($sheetName in $otherSheets) {
        Write-Host "`n📄 $sheetName - Layout Summary" -ForegroundColor Cyan
        $sheet = $workbook.Worksheets.Item($sheetName)
        
        # Check print area and basic layout
        try {
            $printArea = $sheet.PageSetup.PrintArea
            if ($printArea) {
                Write-Host "  Print Area Defined: $printArea"
            }
        } catch {}
        
        # Sample some key cells for content patterns
        $contentSample = @()
        for ($r = 1; $r -le 20; $r++) {
            for ($c = 1; $c -le 10; $c++) {
                $cell = $sheet.Cells.Item($r, $c)
                if ($cell.Value2 -and $cell.Value2.ToString().Length -lt 50) {
                    $contentSample += "$($cell.Address($false, $false)): $($cell.Value2)"
                }
            }
        }
        
        if ($contentSample.Count -gt 0) {
            Write-Host "  Content Sample:"
            foreach ($sample in $contentSample[0..3]) {
                Write-Host "    $sample"
            }
        }
    }
    
    Write-Host "`n✅ Visual design analysis complete!" -ForegroundColor Green
    
    $workbook.Close($false)
    $excel.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
    
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}