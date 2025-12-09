import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DocumentService } from '../../core/services/document.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  activeTab: 'xml' | 'cdr' | 'pdf' = 'pdf';

  xmlContent = '';
  cdrContent = '';
  pdfUrl: SafeResourceUrl | null = null;

  isLoadingXML = false;
  isLoadingCDR = false;
  isLoadingPDF = false;

  xmlError = '';
  cdrError = '';
  pdfError = '';

  private pdfBlobUrl = '';

  constructor(
    private documentService: DocumentService,
    private authService: AuthService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAllDocuments();
  }

  ngOnDestroy(): void {
    if (this.pdfBlobUrl) {
      URL.revokeObjectURL(this.pdfBlobUrl);
    }
  }

  loadAllDocuments(): void {
    this.loadXML();
    this.loadCDR();
    this.loadPDF();
  }

  loadXML(): void {
    this.isLoadingXML = true;
    this.xmlError = '';

    this.documentService.getXML().subscribe({
      next: async (blob) => {
        this.xmlContent = await this.documentService.blobToText(blob);
        this.isLoadingXML = false;
      },
      error: (error) => {
        console.error('Error al cargar XML:', error);
        this.xmlError = 'Error al cargar el archivo XML. Por favor, intente nuevamente.';
        this.isLoadingXML = false;
      },
    });
  }

  loadCDR(): void {
    this.isLoadingCDR = true;
    this.cdrError = '';

    this.documentService.getCDR().subscribe({
      next: async (blob) => {
        this.cdrContent = await this.documentService.blobToText(blob);
        this.isLoadingCDR = false;
      },
      error: (error) => {
        console.error('Error al cargar CDR:', error);
        this.cdrError = 'Error al cargar el archivo CDR. Por favor, intente nuevamente.';
        this.isLoadingCDR = false;
      },
    });
  }

  loadPDF(): void {
    this.isLoadingPDF = true;
    this.pdfError = '';

    this.documentService.getPDF().subscribe({
      next: (blob) => {
        this.pdfBlobUrl = this.documentService.createObjectURL(blob);
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfBlobUrl);
        this.isLoadingPDF = false;
      },
      error: (error) => {
        console.error('Error al cargar PDF:', error);
        this.pdfError = 'Error al cargar el archivo PDF. Por favor, intente nuevamente.';
        this.isLoadingPDF = false;
      },
    });
  }

  setActiveTab(tab: 'xml' | 'cdr' | 'pdf'): void {
    this.activeTab = tab;
  }

  downloadXML(): void {
    this.downloadFile(this.xmlContent, 'documento.xml', 'text/xml');
  }

  downloadCDR(): void {
    this.downloadFile(this.cdrContent, 'cdr.xml', 'text/xml');
  }

  downloadPDF(): void {
    if (this.pdfBlobUrl) {
      const link = document.createElement('a');
      link.href = this.pdfBlobUrl;
      link.download = 'comprobante.pdf';
      link.click();
    }
  }

  private downloadFile(content: string, fileName: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  }

  reloadDocument(): void {
    switch (this.activeTab) {
      case 'xml':
        this.loadXML();
        break;
      case 'cdr':
        this.loadCDR();
        break;
      case 'pdf':
        this.loadPDF();
        break;
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
