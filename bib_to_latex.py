import re
import bibtexparser
from bibtexparser.bparser import BibTexParser
from bibtexparser.customization import convert_to_unicode

def customize_entry(entry):
    """Customize the BibTeX entry."""
    entry = convert_to_unicode(entry)
    return entry

def format_authors(author_string):
    """Format the author list with et al. after first 3 authors."""
    # Split authors and clean up
    authors = [a.strip() for a in author_string.split(' and ')]
    
    # Remove curly braces and extra spaces
    authors = [re.sub(r'{|}', '', author) for author in authors]
    
    # Format first three authors
    if len(authors) > 3:
        return f"{', '.join(authors[:3])}, et al."
    return ', '.join(authors)

def format_title(title):
    """Format the title with proper quotes and italic."""
    # Remove curly braces and extra spaces
    title = re.sub(r'{|}', '', title).strip()
    return f'\\textit{{{title}}}'

def format_journal(journal):
    """Format journal name in bold."""
    # Remove leading backslash and curly braces
    journal = re.sub(r'{|}', '', journal)
    journal = re.sub(r'^\\\s*', '', journal)
    return f'{journal}'

def bib_to_latex(bib_file, output_file):
    """Convert BibTeX file to LaTeX enumerated list."""
    # Parse BibTeX file
    parser = BibTexParser()
    parser.customization = customize_entry
    
    with open(bib_file, 'r', encoding='utf-8') as bibtex_file:
        bib_database = bibtexparser.load(bibtex_file, parser=parser)
    
    # Sort entries by year (newest first)
    entries = sorted(bib_database.entries, key=lambda x: x.get('year', '0'), reverse=True)
    
    # Start LaTeX output
    latex_output = []
    latex_output.append("\\section*{Selected Publications}")
    latex_output.append("\\begin{enumerate}[leftmargin=1.2cm, label=\\textbf{\\arabic*.}]")
    
    # Process each entry
    for entry in entries:
        authors = format_authors(entry.get('author', 'No Author'))
        title = format_title(entry.get('title', 'No Title'))
        journal = format_journal(entry.get('journal', 'No Journal'))
        year = entry.get('year', 'No Year')
        volume = entry.get('volume', '')
        number = entry.get('number', '')
        pages = entry.get('pages', entry.get('eid', ''))
        doi = entry.get('doi', '')
        
        # Format volume and issue
        volume_info = volume
        if number:
            volume_info += f'({number})'
        
        # Build the citation
        citation = [
            f"    \\item {authors},",
            f"{title},",
            f"{journal},",
            f"{volume_info}, {pages} ({year})."
        ]
        
        # Add DOI if available
        if doi:
            citation.append(f"DOI: \\href{{https://doi.org/{doi}}}{{{doi}}}.")
        
        latex_output.append(' '.join(citation))
    
    latex_output.append("\\end{enumerate}")
    
    # Write to file
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write('\n'.join(latex_output))

if __name__ == "__main__":
    # Example usage
    bib_to_latex('pub.bib', 'publications.tex')