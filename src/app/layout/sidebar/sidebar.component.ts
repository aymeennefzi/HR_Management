import {
  Router,
  NavigationEnd,
  RouterLinkActive,
  RouterLink,
} from '@angular/router';
import { DOCUMENT, NgClass } from '@angular/common';
import {
  Component,
  Inject,
  ElementRef,
  OnInit,
  Renderer2,
  HostListener,
  OnDestroy,
} from '@angular/core';
import { ROUTES } from './sidebar-items';
import { AuthService, Role } from '@core';
import { RouteInfo } from './sidebar.metadata';
import { TranslateModule } from '@ngx-translate/core';
import { FeatherModule } from 'angular-feather';
import { NgScrollbar } from 'ngx-scrollbar';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { CookieService } from 'ngx-cookie-service';
import { EmployeesService } from 'app/admin/employees/allEmployees/employees.service';
import { Subscription } from 'rxjs';
import { ImageService } from 'app/admin/employees/image.service';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: true,
  imports: [
    NgScrollbar,
    RouterLinkActive,
    RouterLink,
    NgClass,
    FeatherModule,
    TranslateModule,
  ],
})
export class SidebarComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit, OnDestroy 
{
  public sidebarItems!: RouteInfo[];
  public innerHeight?: number;
  public bodyTag!: HTMLElement;
  listMaxHeight?: string;
  listMaxWidth?: string;
  userFullName?: string;
  userImg?: string;
  userType?: string;
  headerHeight = 60;
  currentRoute?: string;
  private imageUpdatedSubscription!: Subscription;
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    public elementRef: ElementRef,
    private authService: AuthService,
    private router: Router,
    private cookieS : CookieService,
    private employeS : EmployeesService,private imageService: ImageService
  ) {
    super();
    this.elementRef.nativeElement.closest('body');
    this.subs.sink = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.renderer.removeClass(this.document.body, 'overlay-open');
      }
    });
  }
  handleImageUpload(userId: string, file: File) {
    this.employeS.uploadImage(userId, file).subscribe({
      next: (res) => {
        // Le téléchargement de l'image a réussi, vous pouvez traiter la réponse ici
        this.userImg = res.imageUrl; // Assurez-vous que res.imageUrl contient l'URL de l'image téléchargée
        
        // Mettez à jour l'image dans le navigateur si this.userImg n'est pas undefined
        const imageElement = document.querySelector('.img-circle.user-img-circle') as HTMLImageElement;
        if (imageElement && this.userImg) { // Ajoutez cette condition pour vérifier que this.userImg n'est pas undefined
          imageElement.src = this.userImg;
        }
      },
      error: (error) => {
        // Gérez les erreurs de téléchargement de l'image ici
        console.error('Error uploading image:', error);
      },
    });
  }
  
  
  @HostListener('window:resize', ['$event'])
  windowResizecall() {
    this.setMenuHeight();
    this.checkStatuForResize(false);
  }
  @HostListener('document:mousedown', ['$event'])
  onGlobalClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.renderer.removeClass(this.document.body, 'overlay-open');
    }
  }
  callToggleMenu(event: Event, length: number) {
    if (length > 0) {
      const parentElement = (event.target as HTMLInputElement).closest('li');
      const activeClass = parentElement?.classList.contains('active');

      if (activeClass) {
        this.renderer.removeClass(parentElement, 'active');
      } else {
        this.renderer.addClass(parentElement, 'active');
      }
    }
  }
  userData: any; // Variable pour stocker les données utilisateur

  ngOnInit() {
    this.imageUpdatedSubscription = this.imageService.imageUpdated$.subscribe((imageUrl: string) => {
      // Mettez à jour l'image avec l'URL reçu de l'événement
      console.log("imgurl",imageUrl);
      this.userImg = imageUrl;
    });
    const token = this.cookieS.get('token'); // Obtenez le token depuis le cookie
  
    if (token) {
      // Utilisez le token pour récupérer les données de l'utilisateur
      this.employeS.getUserByToken(token).subscribe(
        (userData: any) => {
          console.log(userData); // Affichez userData pour vérification
  
          // Mettez à jour les données de l'utilisateur avec les données obtenues
          const userRole = userData.role; // Accès direct aux rôles de l'utilisateur
          const firstName = userData?.firstname || '';
          const lastName = userData?.lastname || '';
          this.userFullName = `${firstName} ${lastName}`;
        this.userImg = userData?.profileImage;
  
          if (userRole.includes('Admin')) {
            this.sidebarItems = ROUTES.filter((item) => item.role.includes('Admin'));
            this.userType = 'Admin';
          } else if (userRole.includes('Client')) {
            this.sidebarItems = ROUTES.filter((item) => item.role.includes('Client'));
            this.userType = 'Client';
          } else if (userRole.includes('Employe')) {
            this.sidebarItems = ROUTES.filter((item) => item.role.includes('Employee'));
            this.userType = 'Employe';
          } else {
            this.sidebarItems = [];
            this.userType = 'Unknown';
          }
        },
        (error) => {
          console.error('Erreur lors de la récupération des données utilisateur:', error);
        }
      );
    } else {
      console.error('Le cookie "token" n\'est pas défini');
    }
  
    this.initLeftSidebar();
    this.bodyTag = this.document.body;
  }
  
  
  initLeftSidebar() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this;
    // Set menu height
    _this.setMenuHeight();
    _this.checkStatuForResize(true);
  }
  setMenuHeight() {
    this.innerHeight = window.innerHeight;
    const height = this.innerHeight - this.headerHeight;
    this.listMaxHeight = height + '';
    this.listMaxWidth = '500px';
  }
  isOpen() {
    return this.bodyTag.classList.contains('overlay-open');
  }
  checkStatuForResize(firstTime: boolean) {
    if (window.innerWidth < 1025) {
      this.renderer.addClass(this.document.body, 'ls-closed');
    } else {
      this.renderer.removeClass(this.document.body, 'ls-closed');
    }
  }
  mouseHover() {
    const body = this.elementRef.nativeElement.closest('body');
    if (body.classList.contains('submenu-closed')) {
      this.renderer.addClass(this.document.body, 'side-closed-hover');
      this.renderer.removeClass(this.document.body, 'submenu-closed');
    }
  }
  mouseOut() {
    const body = this.elementRef.nativeElement.closest('body');
    if (body.classList.contains('side-closed-hover')) {
      this.renderer.removeClass(this.document.body, 'side-closed-hover');
      this.renderer.addClass(this.document.body, 'submenu-closed');
    }
  }
  logout() {
this.authService.logout();}
imageUrl!: string;
  override ngOnDestroy() {
  this.imageUpdatedSubscription.unsubscribe();
}


}
