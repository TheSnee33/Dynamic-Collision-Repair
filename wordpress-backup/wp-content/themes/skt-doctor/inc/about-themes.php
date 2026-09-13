<?php
//about theme info
add_action( 'admin_menu', 'skt_doctor_abouttheme' );
function skt_doctor_abouttheme() {    	
	add_theme_page( esc_html__('About Theme', 'skt-doctor'), esc_html__('About Theme', 'skt-doctor'), 'edit_theme_options', 'skt_doctor_guide', 'skt_doctor_mostrar_guide');   
} 
//guidline for about theme
function skt_doctor_mostrar_guide() { 
	//custom function about theme customizer
	$return = add_query_arg( array()) ;
?>
<div class="wrapper-info">
	<div class="col-left">
   		   <div class="col-left-area">
			  <?php esc_html_e('Theme Information', 'skt-doctor'); ?>
		   </div>
          <p><?php esc_html_e('SKT Doctor is a gutenberg block based theme which can be used for hospital, clinic, healthcare, pharmacy, medical store, science, lab, drug, medication, veterinary, maternity, healer, general physician, therapist, orthopaedic, eye clinic, pathology, dermatologist, gynecologist, ambulance, physiotherapy, health consultant, pediatrician, psychologist, dentist, nurse, weight loss and health care centre. Compatible with WooCommerce, contact form and SEO plugins.','skt-doctor'); ?></p>
          <a href="<?php echo esc_url(SKT_DOCTOR_SKTTHEMES_PRO_THEME_URL); ?>"><img src="<?php echo esc_url(get_template_directory_uri()); ?>/images/free-vs-pro.png" alt="" /></a>
	</div><!-- .col-left -->
	<div class="col-right">			
			<div class="centerbold">
				<hr />
				<a href="<?php echo esc_url(SKT_DOCTOR_SKTTHEMES_LIVE_DEMO); ?>" target="_blank"><?php esc_html_e('Live Demo', 'skt-doctor'); ?></a> | 
				<a href="<?php echo esc_url(SKT_DOCTOR_SKTTHEMES_PRO_THEME_URL); ?>"><?php esc_html_e('Buy Pro', 'skt-doctor'); ?></a> | 
				<a href="<?php echo esc_url(SKT_DOCTOR_SKTTHEMES_THEME_DOC); ?>" target="_blank"><?php esc_html_e('Documentation', 'skt-doctor'); ?></a>
                <div class="space5"></div>
				<hr />                
                <a href="<?php echo esc_url(SKT_DOCTOR_SKTTHEMES_THEMES); ?>" target="_blank"><img src="<?php echo esc_url(get_template_directory_uri()); ?>/images/sktskill.jpg" alt="" /></a>
			</div>		
	</div><!-- .col-right -->
</div><!-- .wrapper-info -->
<?php } ?>