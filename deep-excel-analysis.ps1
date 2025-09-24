# Enhanced Excel Analysis - Deep Dive
param(
    [string]$FilePath = "C:\Users\Tim\source\repos\RulzLawyer\examples\Rackem19.xlsm"
)

try {
    Write-Host "🔍 Deep Analysis of Rackem19.xlsm Character Sheet System" -ForegroundColor Cyan
    Write-Host "=" * 60
    
    $excel = New-Object -ComObject Excel.Application
    $excel.Visible = $false
    $excel.DisplayAlerts = $false
    
    $workbook = $excel.Workbooks.Open($FilePath)
    
    # Analyze key character sheet worksheets
    $keySheets = @("Character Sheet I", "Character Sheet II", "Character Sheet III", "Character Sheet IV", "Character Sheet V", "Race & Stats", "Classes", "Skills", "Feats", "Options")
    
    foreach ($sheetName in $keySheets) {
        Write-Host "`n🎯 ANALYZING SHEET: '$sheetName'" -ForegroundColor Yellow
        Write-Host "-" * 40
        
        $sheet = $workbook.Worksheets.Item($sheetName)
        
        # Get used range
        if ($sheet.UsedRange) {
            $usedRows = $sheet.UsedRange.Rows.Count
            $usedCols = $sheet.UsedRange.Columns.Count
            Write-Host "Used Range: $usedRows rows x $usedCols columns"
        }
        
        # Sample key areas - look for character data patterns
        Write-Host "`nKey Data Found:"
        
        # Check for ability scores pattern (common locations)
        $abilityAreas = @(
            @{Row = 1; Col = 1; Size = 20 },    # Top-left area
            @{Row = 1; Col = 10; Size = 20 },   # Top-right area  
            @{Row = 20; Col = 1; Size = 20 },   # Mid-left area
            @{Row = 40; Col = 1; Size = 20 }    # Lower area
        )
        
        foreach ($area in $abilityAreas) {
            $foundData = @()
            for ($r = $area.Row; $r -le ($area.Row + $area.Size); $r++) {
                for ($c = $area.Col; $c -le ($area.Col + 10); $c++) {
                    $cell = $sheet.Cells.Item($r, $c)
                    if ($cell.Value2 -and $cell.Value2.ToString().Length -lt 50) {
                        $cellRef = [char](64 + $c) + $r.ToString()
                        $foundData += "$cellRef`: '$($cell.Value2)'"
                    }
                }
            }
            if ($foundData.Count -gt 0) {
                Write-Host "  Area $($area.Row),$($area.Col): $($foundData[0..4] -join '; ')..."
            }
        }
        
        # Look for formulas
        Write-Host "`nFormula Analysis:"
        $formulaCount = 0
        $sampleFormulas = @()
        
        if ($sheet.UsedRange) {
            foreach ($cell in $sheet.UsedRange) {
                if ($cell.Formula -and $cell.Formula.StartsWith("=")) {
                    $formulaCount++
                    if ($sampleFormulas.Count -lt 5) {
                        $cellAddr = $cell.Address($false, $false)
                        $sampleFormulas += "$cellAddr`: $($cell.Formula)"
                    }
                }
            }
        }
        
        Write-Host "  Total Formulas: $formulaCount"
        foreach ($formula in $sampleFormulas) {
            Write-Host "    $formula"
        }
        
        # Check for named ranges
        Write-Host "`nNamed Ranges in this sheet:"
        $namedRanges = @()
        try {
            foreach ($name in $workbook.Names) {
                if ($name.RefersToRange.Worksheet.Name -eq $sheetName) {
                    $namedRanges += "$($name.Name) -> $($name.RefersToRange.Address)"
                }
            }
        }
        catch {}
        
        if ($namedRanges.Count -gt 0) {
            foreach ($range in $namedRanges[0..4]) {
                Write-Host "  $range"
            }
            if ($namedRanges.Count -gt 5) {
                Write-Host "  ... and $($namedRanges.Count - 5) more"
            }
        }
        else {
            Write-Host "  No named ranges found for this sheet"
        }
    }
    
    # Analyze VBA Code
    Write-Host "`n🔧 VBA CODE ANALYSIS" -ForegroundColor Magenta
    Write-Host "-" * 40
    
    try {
        $vbProject = $workbook.VBProject
        $totalLines = 0
        
        for ($i = 1; $i -le $vbProject.VBComponents.Count; $i++) {
            $component = $vbProject.VBComponents.Item($i)
            $lineCount = $component.CodeModule.CountOfLines
            $totalLines += $lineCount
            
            Write-Host "`nModule: $($component.Name) ($lineCount lines)"
            
            if ($lineCount -gt 0) {
                # Extract key procedures/functions
                $procedures = @()
                $inProc = $false
                $currentProc = ""
                
                for ($line = 1; $line -le [Math]::Min($lineCount, 200); $line++) {
                    $code = $component.CodeModule.Lines($line, 1).Trim()
                    
                    if ($code -match "^(Public|Private|Sub|Function)\s+(\w+)" -and -not $code.StartsWith("'")) {
                        $procedures += $code
                    }
                }
                
                if ($procedures.Count -gt 0) {
                    Write-Host "  Key Procedures:"
                    foreach ($proc in $procedures[0..4]) {
                        Write-Host "    $proc"
                    }
                    if ($procedures.Count -gt 5) {
                        Write-Host "    ... and $($procedures.Count - 5) more procedures"
                    }
                }
                
                # Look for D&D specific code patterns
                $dndPatterns = @("ability", "skill", "feat", "class", "race", "attack", "damage", "save", "modifier")
                $foundPatterns = @()
                
                for ($line = 1; $line -le [Math]::Min($lineCount, 500); $line++) {
                    $code = $component.CodeModule.Lines($line, 1).ToLower()
                    foreach ($pattern in $dndPatterns) {
                        if ($code.Contains($pattern) -and -not $code.Trim().StartsWith("'")) {
                            $foundPatterns += "$line`: $($component.CodeModule.Lines($line, 1).Trim())"
                            break
                        }
                    }
                }
                
                if ($foundPatterns.Count -gt 0) {
                    Write-Host "  D&D Related Code Samples:"
                    foreach ($pattern in $foundPatterns[0..3]) {
                        Write-Host "    $pattern"
                    }
                }
            }
        }
        
        Write-Host "`nTotal VBA Code: $totalLines lines across $($vbProject.VBComponents.Count) modules"
        
    }
    catch {
        Write-Host "VBA access restricted: $($_.Exception.Message)"
    }
    
    Write-Host "`n✅ Deep analysis complete!" -ForegroundColor Green
    
}
catch {
    Write-Host "Error during analysis: $($_.Exception.Message)" -ForegroundColor Red
}
finally {
    if ($workbook) { $workbook.Close($false) }
    if ($excel) { 
        $excel.Quit()
        [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
    }
}